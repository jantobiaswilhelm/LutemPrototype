import { X } from 'lucide-react';
import { useToastStore, type ToastType } from '@/stores/toastStore';

const EYEBROW: Record<ToastType, string> = {
  success: 'Noted',
  error:   'Notice',
  info:    'For your attention',
};

const DOT_COLOR: Record<ToastType, string> = {
  success: 'var(--color-accent)',
  error:   'var(--color-error)',
  info:    'var(--color-accent)',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="toast-enter relative flex items-start gap-3 px-5 py-4"
          style={{
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 0,
          }}
        >
          <span
            aria-hidden="true"
            className="mt-[0.45rem] w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: DOT_COLOR[toast.type] }}
          />
          <div className="flex-1 min-w-0">
            <div
              className="font-mono text-[0.6rem] tracking-[0.28em] uppercase mb-1"
              style={{ color: toast.type === 'error' ? 'var(--color-error)' : 'var(--color-text-muted)' }}
            >
              {EYEBROW[toast.type]}
            </div>
            <div
              className="font-serif text-[0.95rem] leading-snug"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 transition-colors"
            style={{ color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            aria-label="Dismiss notification"
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <style>{`
        .toast-enter {
          animation: toast-in 520ms cubic-bezier(.22,.61,.36,1) both;
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(0.75rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .toast-enter { animation: none; }
        }
      `}</style>
    </div>
  );
}
