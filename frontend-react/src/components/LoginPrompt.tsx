import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptProps {
  feature: string;
}

export function LoginPrompt({ feature }: LoginPromptProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8 p-6 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20">
      <div className="text-center">
        <p className="text-[var(--color-text-secondary)] mb-4">
          Sign in to unlock {feature}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogIn className="w-5 h-5" />
          Sign In to Get Started
        </button>
      </div>
    </div>
  );
}

export default LoginPrompt;
