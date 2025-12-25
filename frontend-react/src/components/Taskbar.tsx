import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronLeft,
  Library,
  Settings
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
  { icon: <BarChart2 className="w-5 h-5" />, label: 'Stats', path: '/stats' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Sessions', path: '/sessions' },
  { icon: <Library className="w-5 h-5" />, label: 'Library', path: '/library' },
];

const secondaryItems: NavItem[] = [
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/profile' },
];

export function Taskbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const taskbarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Swipe threshold for opening/closing
  const SWIPE_THRESHOLD = 50;

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  // Handle touch end
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

  // Handle edge swipe to open (when closed)
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen && 
        taskbarRef.current && 
        !taskbarRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Calculate drag offset for smooth animation
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

  return (
    <>
      {/* Edge trigger button */}
      <button
        ref={triggerRef}
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

      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/20 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Taskbar panel */}
      <div
        ref={taskbarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isOpen 
            ? `translateX(${dragOffset}px)` 
            : `translateX(calc(-100% + ${dragOffset}px))`,
        }}
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-56
          bg-[var(--color-bg-secondary)]/95 backdrop-blur-md
          border-r border-[var(--color-border)]
          shadow-xl
          flex flex-col
          ${isDragging ? '' : 'transition-transform duration-300 ease-out'}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-[var(--color-border)]">
          <span className="text-lg font-semibold text-[var(--color-text-primary)]">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
        </nav>

        {/* Secondary items */}
        <div className="p-3 border-t border-[var(--color-border)] space-y-1">
          {secondaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
        </div>

        {/* Swipe hint on mobile */}
        <div className="p-3 text-center md:hidden">
          <span className="text-xs text-[var(--color-text-muted)]">
            Swipe left to close
          </span>
        </div>
      </div>
    </>
  );
}

export default Taskbar;
