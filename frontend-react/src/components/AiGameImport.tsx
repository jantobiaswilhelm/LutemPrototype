import { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  ExternalLink, 
  Lock, 
  Unlock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Coffee
} from 'lucide-react';
import type { UnmatchedGame } from '@/types/steam';

interface AiGameImportProps {
  unmatchedGames: UnmatchedGame[];
  onImport: (games: UnmatchedGame[]) => Promise<void>;
}

// The donation unlock code - in a real app this would be validated server-side
const VALID_CODE = 'R356T2';

export function AiGameImport({ unmatchedGames, onImport }: AiGameImportProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');

  const handleCodeSubmit = () => {
    if (unlockCode.trim().toUpperCase() === VALID_CODE) {
      setIsUnlocked(true);
      setCodeError('');
    } else {
      setCodeError('Invalid code. Please check your donation confirmation.');
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportError('');
    try {
      await onImport(unmatchedGames);
      setImportSuccess(true);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  if (unmatchedGames.length === 0) return null;

  if (importSuccess) {
    return (
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium text-green-600">Games queued for AI import!</p>
            <p className="text-sm text-green-600/80">
              Your games are being processed. This may take a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-[var(--color-accent)]/5 transition-colors"
      >
        <div className="p-2 rounded-lg bg-[var(--color-accent)]/10">
          <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-[var(--color-text-primary)]">
            {unmatchedGames.length} games not in Lutem yet
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Use AI to add them to our database
          </p>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Divider */}
          <div className="h-px bg-[var(--color-border)]" />

          {!isUnlocked ? (
            <>
              {/* Donation explanation */}
              <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">
                      Support Lutem's Development
                    </h4>
                    <p className="text-sm text-[var(--color-text-muted)] mb-3">
                      Adding games with AI costs us money (API tokens aren't free!). 
                      To keep Lutem running, we ask for a small donation to unlock this feature.
                      You'll receive a code after donating.
                    </p>
                    <a
                      href="https://ko-fi.com/lutem"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5E5B] text-white font-medium hover:bg-[#ff4744] transition-colors"
                    >
                      <Coffee className="w-4 h-4" />
                      Support on Ko-fi
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Code input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Already donated? Enter your code:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={unlockCode}
                      onChange={(e) => {
                        setUnlockCode(e.target.value.toUpperCase());
                        setCodeError('');
                      }}
                      placeholder="Enter unlock code"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors uppercase tracking-wider"
                    />
                  </div>
                  <button
                    onClick={handleCodeSubmit}
                    className="px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
                  >
                    Unlock
                  </button>
                </div>
                {codeError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {codeError}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Unlocked state */}
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  AI Import unlocked! Thank you for supporting Lutem ❤️
                </span>
              </div>

              {/* Games preview */}
              <div className="max-h-40 overflow-y-auto rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-3 space-y-2">
                <p className="text-xs text-[var(--color-text-muted)] sticky top-0 bg-[var(--color-bg-secondary)] pb-1">
                  Games to import:
                </p>
                {unmatchedGames.slice(0, 10).map((game) => (
                  <div key={game.steamAppId} className="text-sm text-[var(--color-text-primary)]">
                    • {game.name}
                  </div>
                ))}
                {unmatchedGames.length > 10 && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    ...and {unmatchedGames.length - 10} more
                  </p>
                )}
              </div>

              {/* Import button */}
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing {unmatchedGames.length} games...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Import {unmatchedGames.length} Games with AI
                  </>
                )}
              </button>

              {importError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">{importError}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AiGameImport;
