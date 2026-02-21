import { useState } from 'react';
import { Users, UserPlus, UserCheck, UserX, Search, Clock, X, Loader2 } from 'lucide-react';
import { EmptyFriendsSvg } from '@/components/illustrations';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useAuthStore } from '@/stores/authStore';
import {
  useFriends,
  useIncomingRequests,
  useOutgoingRequests,
  useSearchUsers,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useRemoveFriend,
  useCancelFriendRequest,
} from '@/api/hooks';
import type { UserSummary, FriendRequest } from '@/types';

type Tab = 'friends' | 'requests' | 'find';

export function Friends() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('friends');

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
              <Users className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
              Friends
            </h1>
            <p className="text-[var(--color-text-muted)]">
              Connect with friends to share gaming sessions
            </p>
          </div>
          <LoginPrompt feature="friends and social features" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Friends
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Connect with friends to see their gaming sessions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-[var(--color-bg-secondary)] rounded-xl">
          <TabButton
            active={activeTab === 'friends'}
            onClick={() => setActiveTab('friends')}
            icon={<Users className="w-4 h-4" />}
            label="Friends"
          />
          <TabButton
            active={activeTab === 'requests'}
            onClick={() => setActiveTab('requests')}
            icon={<Clock className="w-4 h-4" />}
            label="Requests"
          />
          <TabButton
            active={activeTab === 'find'}
            onClick={() => setActiveTab('find')}
            icon={<Search className="w-4 h-4" />}
            label="Find"
          />
        </div>

        {/* Content */}
        {activeTab === 'friends' && <FriendsList />}
        {activeTab === 'requests' && <RequestsList />}
        {activeTab === 'find' && <FindUsers />}
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
        font-medium text-sm transition-colors
        ${active
          ? 'bg-[var(--color-accent)] text-white'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function FriendsList() {
  const { data: friends, isLoading, error } = useFriends();
  const removeFriend = useRemoveFriend();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message="Failed to load friends" />;
  }

  if (!friends?.length) {
    return (
      <EmptyState
        icon={<Users className="w-8 h-8" />}
        title="No friends yet"
        description="Search for friends using the Find tab"
      />
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <UserCard
          key={friend.id}
          user={friend}
          action={
            <button
              onClick={() => removeFriend.mutate(friend.id)}
              disabled={removeFriend.isPending}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Remove friend"
            >
              <UserX className="w-5 h-5" />
            </button>
          }
        />
      ))}
    </div>
  );
}

function RequestsList() {
  const { data: incoming, isLoading: loadingIn } = useIncomingRequests();
  const { data: outgoing, isLoading: loadingOut } = useOutgoingRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  const cancelRequest = useCancelFriendRequest();

  if (loadingIn || loadingOut) {
    return <LoadingState />;
  }

  const hasIncoming = incoming && incoming.length > 0;
  const hasOutgoing = outgoing && outgoing.length > 0;

  if (!hasIncoming && !hasOutgoing) {
    return (
      <EmptyState
        icon={<Clock className="w-8 h-8" />}
        title="No pending requests"
        description="Friend requests you send or receive will appear here"
      />
    );
  }

  return (
    <div className="space-y-6">
      {hasIncoming && (
        <section>
          <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
            Incoming Requests ({incoming.length})
          </h3>
          <div className="space-y-3">
            {incoming.map((request: FriendRequest) => (
              <UserCard
                key={request.id}
                user={request.fromUser}
                subtitle={`Sent ${formatDate(request.createdAt)}`}
                action={
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest.mutate(request.id)}
                      disabled={acceptRequest.isPending}
                      className="p-2 rounded-lg text-green-500 hover:bg-green-500/10 transition-colors"
                      title="Accept"
                    >
                      <UserCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => declineRequest.mutate(request.id)}
                      disabled={declineRequest.isPending}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Decline"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      )}

      {hasOutgoing && (
        <section>
          <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
            Sent Requests ({outgoing.length})
          </h3>
          <div className="space-y-3">
            {outgoing.map((request: FriendRequest) => (
              <UserCard
                key={request.id}
                user={request.toUser}
                subtitle={`Sent ${formatDate(request.createdAt)}`}
                action={
                  <button
                    onClick={() => cancelRequest.mutate(request.id)}
                    disabled={cancelRequest.isPending}
                    className="px-3 py-1.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Cancel
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FindUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: results, isLoading, isFetching } = useSearchUsers(searchQuery);
  const { data: friends } = useFriends();
  const { data: outgoing } = useOutgoingRequests();
  const sendRequest = useSendFriendRequest();

  const friendIds = new Set(friends?.map((f) => f.id) || []);
  const pendingIds = new Set(outgoing?.map((r) => r.toUser.id) || []);

  const getStatus = (userId: number): 'friend' | 'pending' | 'none' => {
    if (friendIds.has(userId)) return 'friend';
    if (pendingIds.has(userId)) return 'pending';
    return 'none';
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by display name..."
          className="
            w-full pl-12 pr-4 py-3 rounded-xl
            bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent)]
            transition-colors
          "
        />
        {(isLoading || isFetching) && searchQuery.length >= 2 && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-accent)] animate-spin" />
        )}
      </div>

      {/* Results */}
      {searchQuery.length < 2 ? (
        <p className="text-center text-sm text-[var(--color-text-muted)] py-8">
          Enter at least 2 characters to search
        </p>
      ) : results?.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No users found"
          description={`No users matching "${searchQuery}"`}
        />
      ) : results ? (
        <div className="space-y-3">
          {results.map((user: UserSummary) => {
            const status = getStatus(user.id);
            return (
              <UserCard
                key={user.id}
                user={user}
                action={
                  status === 'friend' ? (
                    <span className="text-sm text-green-500 flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />
                      Friends
                    </span>
                  ) : status === 'pending' ? (
                    <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => sendRequest.mutate(user.id)}
                      disabled={sendRequest.isPending}
                      className="
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-[var(--color-accent)] text-white text-sm font-medium
                        hover:opacity-90 transition-opacity
                        disabled:opacity-50
                      "
                    >
                      <UserPlus className="w-4 h-4" />
                      Add
                    </button>
                  )
                }
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function UserCard({
  user,
  subtitle,
  action,
}: {
  user: UserSummary;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
      {/* Avatar */}
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          className="w-12 h-12 rounded-xl object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-[var(--color-accent)]">
            {user.displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[var(--color-text-primary)] truncate">
          {user.displayName}
        </h4>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
        )}
      </div>

      {/* Action */}
      {action}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-[var(--color-text-muted)]">{message}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-12">
      <EmptyFriendsSvg className="w-48 h-36 mx-auto mb-2" />
      <h3 className="font-medium text-[var(--color-text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default Friends;
