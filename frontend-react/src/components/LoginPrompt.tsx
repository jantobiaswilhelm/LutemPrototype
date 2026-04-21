import { useNavigate } from 'react-router-dom';

interface LoginPromptProps {
  feature: string;
}

export function LoginPrompt({ feature }: LoginPromptProps) {
  const navigate = useNavigate();

  return (
    <div
      className="mt-10 py-10 flex flex-col items-center text-center max-w-[40ch] mx-auto"
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        className="flex items-center gap-3 mb-5 font-mono text-[0.68rem] tracking-[0.28em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
        An invitation
      </div>

      <p
        className="font-serif italic text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.35] mb-6"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Sign in to unlock {feature}.
      </p>

      <button
        onClick={() => navigate('/login')}
        className="login-prompt-link relative font-serif italic font-medium text-[1.25rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
        style={{ color: 'var(--color-accent)' }}
      >
        Sign in
        <span aria-hidden="true" className="login-prompt-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
        <span
          aria-hidden="true"
          className="login-prompt-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
          style={{ background: 'var(--color-accent)', right: '30%' }}
        />
      </button>

      <style>{`
        .login-prompt-link:hover {
          letter-spacing: 0.04em;
        }
        .login-prompt-link:hover .login-prompt-underline {
          right: 0 !important;
        }
        .login-prompt-link:hover .login-prompt-arrow {
          transform: translateX(0.4rem);
        }
      `}</style>
    </div>
  );
}

export default LoginPrompt;
