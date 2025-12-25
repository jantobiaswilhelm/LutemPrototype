import { useState } from 'react';
import { Link2, ExternalLink, Loader2, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useSteamStore } from '@/stores/steamStore';

interface SteamConnectProps {
  firebaseUid: string;
}

export function SteamConnect({ firebaseUid }: SteamConnectProps) {
  const [steamId, setSteamId] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  
  const { 
    isConnected, 
    isLoading, 
    error, 
    lastImport,
    library,
    importLibrary, 
    disconnect,
    clearError,
  } = useSteamStore();

  const handleImport = async () => {
    if (!steamId.trim()) return;
    
    // Validate Steam ID format (17 digits)
    if (!/^\d{17}$/.test(steamId.trim())) {
      useSteamStore.setState({ 
        error: 'Steam ID should be 17 digits. Find yours at steamid.io' 
      });
      return;
    }
    
    try {
      await importLibrary(steamId.trim(), firebaseUid);
    } catch {
      // Error is handled in store
    }
  };

  // Connected state - show library summary
  if (isConnected && library) {
    const { summary } = library;
    return (
      <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-text-primary)]">Steam Connected</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {summary.taggedGames} games ready for recommendations
              </p>
            </div>
          </div>
          <button
            onClick={disconnect}
            className="text-xs text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
          >
            Disconnect
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
            <div className="text-lg font-bold text-[var(--color-text-primary)]">
              {summary.steamGames}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Imported</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
            <div className="text-lg font-bold text-[var(--color-accent)]">
              {summary.taggedGames}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Tagged</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
            <div className="text-lg font-bold text-[var(--color-text-muted)]">
              {summary.untaggedGames}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Pending</div>
          </div>
        </div>

        {/* Last import info */}
        {lastImport && (
          <p className="mt-3 text-xs text-[var(--color-text-muted)] text-center">
            {lastImport.message}
          </p>
        )}
      </div>
    );
  }

  // Not connected - show import form
  return (
    <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 rounded-xl bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
          <Link2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-[var(--color-text-primary)] mb-1">
            Connect Steam
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Import your library to get personalized recommendations
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-500">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-400">
            ×
          </button>
        </div>
      )}

      {/* Steam ID input */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">
            Your Steam ID (64-bit)
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="ml-1 text-[var(--color-accent)] hover:underline inline-flex items-center"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </label>
          <input
            type="text"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="76561198012345678"
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Help text */}
        {showHelp && (
          <div className="p-3 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 text-sm">
            <p className="text-[var(--color-text-secondary)] mb-2">
              <strong>How to find your Steam ID:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-muted)]">
              <li>Go to <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">steamid.io</a></li>
              <li>Enter your Steam profile URL</li>
              <li>Copy the <strong>steamID64</strong> (17 digits)</li>
            </ol>
            <p className="mt-2 text-[var(--color-text-muted)]">
              ⚠️ Your Steam profile and game details must be set to <strong>Public</strong>
            </p>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={isLoading || !steamId.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              Import Library
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Compact prompt to import Steam library - for use elsewhere in the app
 */
export function SteamImportPrompt({ onNavigateToProfile }: { onNavigateToProfile: () => void }) {
  const { isConnected } = useSteamStore();
  
  if (isConnected) return null;
  
  return (
    <div className="p-4 rounded-xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20">
      <div className="flex items-center gap-3">
        <Link2 className="w-5 h-5 text-[var(--color-accent)]" />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong>Connect Steam</strong> to get recommendations from your own library
          </p>
        </div>
        <button
          onClick={onNavigateToProfile}
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Connect →
        </button>
      </div>
    </div>
  );
}
