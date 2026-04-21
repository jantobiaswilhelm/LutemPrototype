import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Clock,
  User,
  Users,
  ChevronRight,
  Library,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useGames, useSessionHistory, useFriends } from '@/api/hooks';

const DESKTOP_QUERY = '(min-width: 1024px)';

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(DESKTOP_QUERY);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  numeral: string;
  descriptor: string;
  countKey?: 'sessions' | 'library' | 'friends';
}

const primaryItems: NavItem[] = [
  { icon: <Home     className="w-3.5 h-3.5" />, label: 'Home',     path: '/',         numeral: '01', descriptor: "Tonight's play"   },
  { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Calendar', path: '/calendar', numeral: '02', descriptor: 'Scheduled'        },
  { icon: <Clock    className="w-3.5 h-3.5" />, label: 'Sessions', path: '/sessions', numeral: '03', descriptor: 'Recent history',  countKey: 'sessions' },
  { icon: <Library  className="w-3.5 h-3.5" />, label: 'Library',  path: '/library',  numeral: '04', descriptor: 'Your games',      countKey: 'library'  },
  { icon: <Users    className="w-3.5 h-3.5" />, label: 'Friends',  path: '/friends',  numeral: '05', descriptor: 'Others playing',  countKey: 'friends'  },
];

const secondaryItems: NavItem[] = [
  { icon: <Settings className="w-3.5 h-3.5" />, label: 'Settings', path: '/settings', numeral: 'a.', descriptor: '' },
  { icon: <User     className="w-3.5 h-3.5" />, label: 'Profile',  path: '/profile',  numeral: 'b.', descriptor: '' },
];

function currentIssueLabel(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const season =
    month >= 2 && month <= 4 ? 'spring' :
    month >= 5 && month <= 7 ? 'summer' :
    month >= 8 && month <= 10 ? 'autumn' :
    'winter';
  return `${season} ${year}`;
}

export function Taskbar() {
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const taskbarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRecommendation } = useRecommendationStore();
  const featured = currentRecommendation?.topRecommendation;

  // Live counts — hooks are deduped by react-query so these are free if already fetched elsewhere
  const { data: games } = useGames();
  const { data: sessionHistory } = useSessionHistory();
  const { data: friends } = useFriends();
  const counts = {
    sessions: sessionHistory?.length,
    library: games?.length,
    friends: friends?.length,
  } as Record<'sessions' | 'library' | 'friends', number | undefined>;

  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    if (!isDesktop) setIsOpen(false);
  }, [location.pathname, isDesktop]);

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };
  const handleTriggerEnter = () => { cancelClose(); setIsOpen(true); };
  const handlePanelEnter = () => { cancelClose(); };
  const handlePanelLeave = () => { scheduleClose(); };

  useEffect(() => () => cancelClose(), []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = currentX - startX;
    if (!isOpen && diff > SWIPE_THRESHOLD) setIsOpen(true);
    else if (isOpen && diff < -SWIPE_THRESHOLD) setIsOpen(false);
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  useEffect(() => {
    const handleEdgeSwipe = (e: TouchEvent) => {
      if (e.touches[0].clientX <= 20 && !isOpen) {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
      }
    };
    window.addEventListener('touchstart', handleEdgeSwipe);
    return () => window.removeEventListener('touchstart', handleEdgeSwipe);
  }, [isOpen]);

  const getDragOffset = () => {
    if (!isDragging) return 0;
    const diff = currentX - startX;
    if (!isOpen) return Math.max(0, Math.min(diff, 200));
    return Math.min(0, Math.max(diff, -200));
  };
  const dragOffset = getDragOffset();

  const handleLogout = async () => {
    await logout();
    if (!isDesktop) setIsOpen(false);
    navigate('/');
  };

  const showPanel = isDesktop || isOpen;
  const providerLabel = user?.authProvider === 'steam' ? 'via steam' : user?.authProvider === 'google' ? 'via google' : '';

  return (
    <>
      {/* Edge trigger — mobile only */}
      {!isDesktop && (
        <button
          ref={triggerRef}
          onMouseEnter={handleTriggerEnter}
          onMouseLeave={scheduleClose}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 w-6 h-16 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{
            background: 'var(--color-bg-primary)',
            borderTop: '1px solid var(--color-border-strong)',
            borderRight: '1px solid var(--color-border-strong)',
            borderBottom: '1px solid var(--color-border-strong)',
            borderLeft: 'none',
            color: 'var(--color-text-secondary)',
          }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Backdrop — mobile only */}
      {!isDesktop && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(20, 17, 14, 0.35)' }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        ref={taskbarRef}
        aria-label="Main navigation"
        aria-hidden={!showPanel}
        onMouseEnter={!isDesktop ? handlePanelEnter : undefined}
        onMouseLeave={!isDesktop ? handlePanelLeave : undefined}
        onTouchStart={!isDesktop ? handleTouchStart : undefined}
        onTouchMove={!isDesktop ? handleTouchMove : undefined}
        onTouchEnd={!isDesktop ? handleTouchEnd : undefined}
        style={
          isDesktop
            ? { background: 'var(--color-bg-primary)', borderRight: '1px solid var(--color-border-strong)' }
            : {
                transform: isOpen ? `translateX(${dragOffset}px)` : `translateX(calc(-100% + ${dragOffset}px))`,
                background: 'var(--color-bg-primary)',
                borderRight: '1px solid var(--color-border-strong)',
              }
        }
        className={`fixed left-0 top-0 bottom-0 z-50 w-56 flex flex-col overflow-y-auto hide-scrollbar ${isDesktop ? 'translate-x-0' : (isDragging ? '' : 'transition-transform duration-300 ease-out')}`}
      >
        {/* ─── masthead ─── */}
        <div
          className="px-5 pt-6 pb-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <NavLink
            to="/"
            onClick={() => { if (!isDesktop) setIsOpen(false); }}
            className="block"
            aria-label="Lutem — home"
          >
            <span
              className="font-serif font-semibold text-[1.35rem] tracking-tight leading-none"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Lutem<span style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>.</span>
            </span>
          </NavLink>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
            <span
              className="font-mono text-[0.55rem] tracking-[0.22em] uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              programme &#8470;&thinsp;07
            </span>
            <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
          </div>
        </div>

        {/* ─── user ─── */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-8 h-8 object-cover"
                  style={{ border: '1px solid var(--color-border-strong)', borderRadius: 0 }}
                />
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  style={{ border: '1px solid var(--color-border-strong)', color: 'var(--color-text-muted)' }}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div
                  className="font-serif italic text-[0.9rem] leading-tight truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {user.displayName}
                </div>
                <div
                  className="font-mono text-[0.55rem] tracking-[0.22em] uppercase mt-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {providerLabel}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isDesktop) setIsOpen(false);
                navigate('/login');
              }}
              className="taskbar-sign-in relative font-serif italic text-[1rem] inline-flex items-baseline gap-1.5 bg-transparent border-0 p-0 pb-1 cursor-pointer transition-[letter-spacing] duration-500"
              style={{ color: 'var(--color-accent)' }}
            >
              Sign in
              <span aria-hidden="true" className="taskbar-sign-in-arrow font-sans not-italic transition-transform duration-500">→</span>
              <span
                aria-hidden="true"
                className="taskbar-sign-in-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
                style={{ background: 'var(--color-accent)', right: '30%' }}
              />
            </button>
          )}
        </div>

        {/* ─── contents ─── */}
        <div className="px-5 pt-5 pb-3">
          <div
            className="font-mono text-[0.55rem] tracking-[0.32em] uppercase mb-4 flex items-center gap-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span>Programme</span>
            <span className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <ul className="list-none p-0 m-0">
            {primaryItems.map((item) => (
              <li key={item.path} className="mb-3.5 last:mb-0">
                <NavLink
                  to={item.path}
                  onClick={() => { if (!isDesktop) setIsOpen(false); }}
                  className="taskbar-link group block py-1"
                >
                  {({ isActive }) => (
                    <>
                      <div className="grid grid-cols-[1.4rem_1fr_auto] items-baseline gap-2">
                        <span
                          className="font-mono text-[0.62rem] tracking-[0.08em]"
                          style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                        >
                          {item.numeral}
                        </span>
                        <span
                          className="font-serif text-[1.05rem] leading-none truncate"
                          style={{
                            color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                            fontStyle: isActive ? 'italic' : 'normal',
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="font-mono text-[0.58rem] tracking-[0.05em] tabular-nums"
                          style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)', opacity: isActive ? 1 : 0.55 }}
                        >
                          {item.countKey && typeof counts[item.countKey] === 'number' ? counts[item.countKey] : ''}
                        </span>
                      </div>
                      <div
                        className="font-serif italic text-[0.78rem] leading-snug mt-1 pl-[calc(1.4rem+0.5rem)]"
                        style={{
                          color: isActive ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                        }}
                      >
                        {item.descriptor}
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── featured ─── */}
        {featured && (
          <div
            className="px-5 pt-4 pb-5"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div
              className="font-mono text-[0.55rem] tracking-[0.32em] uppercase mb-3 flex items-center gap-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span style={{ color: 'var(--color-accent)' }}>●</span>
              <span>Now showing</span>
              <span className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>
            <NavLink
              to="/"
              onClick={() => { if (!isDesktop) setIsOpen(false); }}
              className="taskbar-featured block group"
            >
              <div className="flex gap-3 items-start">
                <div
                  className="shrink-0 overflow-hidden aspect-[600/900] w-10"
                  style={{
                    background: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-strong)',
                  }}
                >
                  {featured.imageUrl && (
                    <img
                      src={featured.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      style={{ filter: 'contrast(1.05) saturate(0.9)' }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div
                    className="font-serif text-[0.92rem] leading-tight truncate"
                    style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
                  >
                    {featured.name}
                  </div>
                  <div
                    className="font-serif italic text-[0.72rem] leading-snug mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    tonight&rsquo;s selection
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        )}

        {/* ─── apparatus (settings/profile) ─── */}
        <div
          className="px-5 pt-4 pb-3 mt-auto"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div
            className="font-mono text-[0.55rem] tracking-[0.32em] uppercase mb-3 flex items-center gap-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span>About</span>
            <span className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>
          <ul className="list-none p-0 m-0 space-y-1">
            {secondaryItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => { if (!isDesktop) setIsOpen(false); }}
                  className="taskbar-link flex items-baseline gap-2 py-1"
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="font-mono text-[0.62rem] tracking-[0.08em] w-[1.4rem]"
                        style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                      >
                        {item.numeral}
                      </span>
                      <span
                        className="font-serif text-[0.95rem] leading-none flex-1"
                        style={{
                          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                          fontStyle: isActive ? 'italic' : 'normal',
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="taskbar-signout mt-4 font-mono text-[0.6rem] tracking-[0.18em] uppercase bg-transparent border-0 cursor-pointer pb-1 transition-colors duration-300"
              style={{
                color: 'var(--color-text-muted)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Sign out
            </button>
          )}
        </div>

        {/* ─── colophon ─── */}
        <div
          className="px-5 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div
            className="font-serif italic text-[0.72rem] leading-snug"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Lutem<span style={{ color: 'var(--color-accent)' }}>.</span> &mdash; considered play.
          </div>
          <div
            className="font-mono text-[0.55rem] tracking-[0.22em] uppercase mt-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {currentIssueLabel()}
          </div>
        </div>

        {!isDesktop && (
          <div
            className="px-5 py-2 font-mono text-[0.55rem] tracking-[0.22em] uppercase text-center"
            style={{
              color: 'var(--color-text-muted)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            swipe left to close
          </div>
        )}
      </nav>

      <style>{`
        .taskbar-link:hover {
          background: var(--color-bg-secondary);
        }
        .taskbar-featured:hover {
          background: var(--color-bg-secondary);
        }
        .taskbar-sign-in:hover {
          letter-spacing: 0.03em;
        }
        .taskbar-sign-in:hover .taskbar-sign-in-underline {
          right: 0 !important;
        }
        .taskbar-sign-in:hover .taskbar-sign-in-arrow {
          transform: translateX(0.3rem);
        }
        .taskbar-signout:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
      `}</style>
    </>
  );
}

export default Taskbar;
