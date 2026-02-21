import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Clock,
  User,
  Users,
  ChevronRight,
  ChevronLeft,
  Library,
  Settings,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

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
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Calendar', path: '/calendar' },
  { icon: <Clock className="w-5 h-5" />, label: 'Sessions', path: '/sessions' },
  { icon: <Library className="w-5 h-5" />, label: 'Library', path: '/library' },
  { icon: <Users className="w-5 h-5" />, label: 'Friends', path: '/friends' },
];

const secondaryItems: NavItem[] = [
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/profile' },
];

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

  const SWIPE_THRESHOLD = 50;

  // Close mobile overlay on route change
  useEffect(() => {
    if (!isDesktop) setIsOpen(false);
  }, [location.pathname, isDesktop]);

  // Hover open/close logic
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

  const handleTriggerEnter = () => {
    cancelClose();
    setIsOpen(true);
  };

  const handlePanelEnter = () => {
    cancelClose();
  };

  const handlePanelLeave = () => {
    scheduleClose();
  };

  useEffect(() => {
    return () => cancelClose();
  }, []);

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
    if (!isOpen && diff > SWIPE_THRESHOLD) {
      setIsOpen(true);
    } else if (isOpen && diff < -SWIPE_THRESHOLD) {
      setIsOpen(false);
    }
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
    if (!isOpen) {
      return Math.max(0, Math.min(diff, 200));
    } else {
      return Math.min(0, Math.max(diff, -200));
    }
  };

  const dragOffset = getDragOffset();

  const handleLogout = async () => {
    await logout();
    if (!isDesktop) setIsOpen(false);
    navigate('/');
  };

  const showPanel = isDesktop || isOpen;

  return (
    <>
      {/* Edge trigger button — mobile only */}
      {!isDesktop && (
        <button
          ref={triggerRef}
          onMouseEnter={handleTriggerEnter}
          onMouseLeave={scheduleClose}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed left-0 top-1/2 -translate-y-1/2 z-50
            w-6 h-16
            flex items-center justify-center
            bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm
            border border-l-0 border-[var(--color-border)]
            rounded-r-lg
            text-[var(--color-text-muted)]
            hover:text-[var(--color-accent)]
            hover:bg-[var(--color-bg-secondary)]
            transition-all duration-200
            shadow-sm
            ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Backdrop — mobile only */}
      {!isDesktop && (
        <div
          className={`
            fixed inset-0 z-40
            bg-black/20 backdrop-blur-[2px]
            transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Taskbar panel */}
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
            ? undefined
            : {
                transform: isOpen
                  ? `translateX(${dragOffset}px)`
                  : `translateX(calc(-100% + ${dragOffset}px))`,
              }
        }
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-56
          bg-[var(--color-bg-secondary)]/95 backdrop-blur-md
          border-r border-[var(--color-border)]
          flex flex-col
          ${isDesktop
            ? 'translate-x-0'
            : `shadow-xl ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`
          }
        `}
      >
        {/* Header with user info */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-[var(--color-text-primary)]">
              Menu
            </span>
            {!isDesktop && (
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* User info or login button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.displayName} 
                  className="w-10 h-10 rounded-full border-2 border-[var(--color-border)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] capitalize">
                  {user.authProvider === 'steam' ? '🎮 Steam' : '📧 Google'}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isDesktop) setIsOpen(false);
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          )}
        </div>

        {/* Navigation items - ALL items always visible */}
        <div className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if (!isDesktop) setIsOpen(false); }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-150
                ${isActive
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                }
              `}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Secondary items */}
        <div className="p-3 border-t border-[var(--color-border)] space-y-1">
          {secondaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if (!isDesktop) setIsOpen(false); }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-150
                ${isActive
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-secondary)]'
                }
              `}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Logout button */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          )}
        </div>

        {/* Swipe hint on mobile */}
        {!isDesktop && (
          <div className="p-3 text-center">
            <span className="text-xs text-[var(--color-text-muted)]">
              Swipe left to close
            </span>
          </div>
        )}
      </nav>
    </>
  );
}

export default Taskbar;
