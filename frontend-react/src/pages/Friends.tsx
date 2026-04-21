import { useState } from 'react';
import { User } from 'lucide-react';
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
      <main className="min-h-screen">
        <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
          <header
            className="pb-5 mb-10 md:mb-14"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div
              className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span
                className="inline-block w-6 h-px"
                style={{ background: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              § Companions
            </div>
            <h1
              className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Friends.
            </h1>
            <p
              className="font-serif italic text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Connect with friends to share gaming sessions.
            </p>
          </header>
          <LoginPrompt feature="friends and social features" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
        {/* ─── masthead ─────────────────────────────────── */}
        <header
          className="pb-5 mb-10 md:mb-14"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-6 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            § Companions
          </div>
          <h1
            className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Friends.
          </h1>
          <p
            className="font-serif italic text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Who you play alongside, who is looking for a session.
          </p>
        </header>

        {/* ─── tabs ─────────────────────────────────────── */}
        <div
          className="flex items-baseline gap-8 pb-3 mb-10"
          style={{ borderBottom: '1px solid var(--color-border)' }}
          role="tablist"
          aria-label="Friends tabs"
        >
          {([
            { id: 'friends', label: 'Friends' },
            { id: 'requests', label: 'Requests' },
            { id: 'find', label: 'Find' },
          ] as { id: Tab; label: string }[]).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className="relative font-serif text-[1.05rem] leading-none bg-transparent border-0 p-0 pb-2 cursor-pointer transition-colors duration-300"
                style={{
                  color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  fontStyle: active ? 'italic' : 'normal',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {tab.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[13px] h-px"
                    style={{ background: 'var(--color-accent)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── content ──────────────────────────────────── */}
        {activeTab === 'friends' && <FriendsList />}
        {activeTab === 'requests' && <RequestsList />}
        {activeTab === 'find' && <FindUsers />}
      </div>
    </main>
  );
}

function FriendsList() {
  const { data: friends, isLoading, error } = useFriends();
  const removeFriend = useRemoveFriend();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load friends" />;

  if (!friends?.length) {
    return (
      <EmptyState
        title="No friends yet."
        description="Search by display name in the Find tab."
      />
    );
  }

  return (
    <div>
      {friends.map((friend) => (
        <UserRow
          key={friend.id}
          user={friend}
          action={
            <button
              onClick={() => removeFriend.mutate(friend.id)}
              disabled={removeFriend.isPending}
              className="friend-remove font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
              style={{
                color: 'var(--color-text-muted)',
                borderBottom: '1px solid var(--color-border)',
              }}
              aria-label={`Remove friend ${friend.displayName}`}
            >
              Remove
            </button>
          }
        />
      ))}
      <style>{`
        .friend-remove:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
      `}</style>
    </div>
  );
}

function RequestsList() {
  const { data: incoming, isLoading: loadingIn } = useIncomingRequests();
  const { data: outgoing, isLoading: loadingOut } = useOutgoingRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  const cancelRequest = useCancelFriendRequest();

  if (loadingIn || loadingOut) return <LoadingState />;

  const hasIncoming = incoming && incoming.length > 0;
  const hasOutgoing = outgoing && outgoing.length > 0;

  if (!hasIncoming && !hasOutgoing) {
    return (
      <EmptyState
        title="No pending requests."
        description="Requests you send or receive will appear here."
      />
    );
  }

  return (
    <div className="space-y-10">
      {hasIncoming && (
        <section>
          <div
            className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-5 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            Incoming &middot; {incoming.length}
            <span
              className="flex-1 h-px"
              style={{ background: 'var(--color-border)' }}
              aria-hidden="true"
            />
          </div>

          {incoming.map((request: FriendRequest) => (
            <UserRow
              key={request.id}
              user={request.fromUser}
              subtitle={`sent ${formatDate(request.createdAt)}`}
              action={
                <div className="flex items-baseline gap-5 shrink-0">
                  <button
                    onClick={() => acceptRequest.mutate(request.id)}
                    disabled={acceptRequest.isPending}
                    className="friend-accept font-serif italic text-[0.95rem] leading-none bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                    style={{
                      color: 'var(--color-accent)',
                      borderBottom: '1px solid var(--color-accent)',
                    }}
                    aria-label={`Accept request from ${request.fromUser.displayName}`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineRequest.mutate(request.id)}
                    disabled={declineRequest.isPending}
                    className="friend-decline font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                    style={{
                      color: 'var(--color-text-muted)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                    aria-label={`Decline request from ${request.fromUser.displayName}`}
                  >
                    Decline
                  </button>
                </div>
              }
            />
          ))}
        </section>
      )}

      {hasOutgoing && (
        <section>
          <div
            className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-5 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            Sent &middot; {outgoing.length}
            <span
              className="flex-1 h-px"
              style={{ background: 'var(--color-border)' }}
              aria-hidden="true"
            />
          </div>

          {outgoing.map((request: FriendRequest) => (
            <UserRow
              key={request.id}
              user={request.toUser}
              subtitle={`sent ${formatDate(request.createdAt)}`}
              action={
                <button
                  onClick={() => cancelRequest.mutate(request.id)}
                  disabled={cancelRequest.isPending}
                  className="friend-cancel font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                  aria-label={`Cancel request to ${request.toUser.displayName}`}
                >
                  Cancel
                </button>
              }
            />
          ))}
        </section>
      )}

      <style>{`
        .friend-decline:hover,
        .friend-cancel:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
      `}</style>
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
    <div>
      {/* Search input — hairline underline only */}
      <div className="mb-8">
        <label
          htmlFor="friend-search"
          className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Search
        </label>
        <div className="relative">
          <input
            id="friend-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="By display name…"
            className="w-full py-2 px-0 bg-transparent font-serif text-[1.05rem] focus:outline-none"
            style={{
              border: 'none',
              borderBottom: '1px solid var(--color-border-strong)',
              color: 'var(--color-text-primary)',
              borderRadius: 0,
            }}
          />
          {(isLoading || isFetching) && searchQuery.length >= 2 && (
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[0.58rem] tracking-[0.28em] uppercase"
              style={{ color: 'var(--color-accent)' }}
              aria-live="polite"
            >
              searching…
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {searchQuery.length < 2 ? (
        <p
          className="font-serif italic text-[0.95rem] py-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Enter at least two characters to search.
        </p>
      ) : results?.length === 0 ? (
        <EmptyState
          title="No users found."
          description={`No one matching "${searchQuery}".`}
        />
      ) : results ? (
        <div>
          {results.map((user: UserSummary) => {
            const status = getStatus(user.id);
            return (
              <UserRow
                key={user.id}
                user={user}
                action={
                  status === 'friend' ? (
                    <span
                      className="font-mono text-[0.62rem] tracking-[0.22em] uppercase"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      friends
                    </span>
                  ) : status === 'pending' ? (
                    <span
                      className="font-mono text-[0.62rem] tracking-[0.22em] uppercase"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      pending
                    </span>
                  ) : (
                    <button
                      onClick={() => sendRequest.mutate(user.id)}
                      disabled={sendRequest.isPending}
                      className="friend-add relative font-serif italic text-[0.95rem] leading-none inline-flex items-baseline gap-1.5 bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-[letter-spacing] duration-300"
                      style={{ color: 'var(--color-accent)' }}
                      aria-label={`Send friend request to ${user.displayName}`}
                    >
                      Add
                      <span aria-hidden="true">&rarr;</span>
                      <span
                        aria-hidden="true"
                        className="friend-add-underline absolute left-0 bottom-0 h-px transition-[right] duration-[500ms]"
                        style={{ background: 'var(--color-accent)', right: '30%' }}
                      />
                    </button>
                  )
                }
              />
            );
          })}
        </div>
      ) : null}

      <style>{`
        .friend-add:hover { letter-spacing: 0.03em; }
        .friend-add:hover .friend-add-underline { right: 0 !important; }
      `}</style>
    </div>
  );
}

function UserRow({
  user,
  subtitle,
  action,
}: {
  user: UserSummary;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="user-row flex items-center gap-4 py-3 px-3 -mx-3 transition-colors duration-300"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      {/* Square avatar, hairline border */}
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          className="w-10 h-10 object-cover shrink-0"
          style={{ border: '1px solid var(--color-border-strong)', borderRadius: 0 }}
        />
      ) : (
        <div
          className="w-10 h-10 flex items-center justify-center shrink-0"
          style={{
            border: '1px solid var(--color-border-strong)',
            color: 'var(--color-text-muted)',
          }}
          aria-hidden="true"
        >
          <User className="w-4 h-4" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div
          className="font-serif text-[1rem] leading-tight truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {user.displayName}
        </div>
        {subtitle && (
          <div
            className="font-mono text-[0.62rem] tracking-[0.14em] mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {action}

      <style>{`
        .user-row:hover {
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="flex items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block w-2 h-2 rounded-full friends-pulse"
        style={{ background: 'var(--color-accent)' }}
        aria-hidden="true"
      />
      <span
        className="font-mono text-[0.62rem] tracking-[0.28em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        loading
      </span>
      <style>{`
        @keyframes friends-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .friends-pulse { animation: friends-pulse 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="py-10">
      <div
        className="font-mono text-[0.62rem] tracking-[0.3em] uppercase mb-2"
        style={{ color: 'var(--color-error)' }}
      >
        &mdash; notice &mdash;
      </div>
      <p
        className="font-serif italic text-[1rem]"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {message}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="py-10">
      <p
        className="font-serif italic text-[1.1rem] leading-snug mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </p>
      <p
        className="font-serif italic text-[0.95rem] leading-snug max-w-[44ch]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {description}
      </p>
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
