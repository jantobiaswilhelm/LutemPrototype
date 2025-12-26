import { useState, useEffect } from 'react';
import { Link2, ExternalLink, Loader2, CheckCircle, AlertCircle, HelpCircle, Sparkles, Clock } from 'lucide-react';
import { useSteamStore, useTaggingState } from '@/stores/steamStore';

// Note: JWT auth is handled automatically by the steam API client
export function SteamConnect() {
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
    fetchGameStats,
    tagPendingGames,
  } = useSteamStore();
  
  const { isTagging, taggingProgress, gameStats } = useTaggingState();

  // Fetch game stats when connected
  useEffect(() => {
    if (isConnected) {
      fetchGameStats().catch(console.error);
    }
  }, [isConnected, fetchGameStats]);

  const handleImport = async () => {
    if (!steamId.trim()) return;
    
    try {
      // JWT auth handled automatically by steam API client
      await importLibrary(steamId.trim());
    } catch {
      // Error is handled in store
    }
  };

  const handleTagPending = async () => {
    try {
      await tagPendingGames();
    } catch {
      // Error is handled in store
    }
  };

  const pendingCount = gameStats?.pending ?? library?.summary.untaggedGames ?? 0;
  const taggedCount = gameStats?.fullyTagged ?? library?.summary.taggedGames ?? 0;
  const aiConfigured = gameStats?.aiConfigured ?? false;

  // Connected state - show library summary and tagging options
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
                {taggedCount} games ready for recommendations
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
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
            <div className="text-lg font-bold text-[var(--color-text-primary)]">
              {summary.steamGames}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Imported</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
            <div className="text-lg font-bold text-[var(--color-accent)]">
              {taggedCount}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Ready</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
            <div className="text-lg font-bold text-amber-500">
              {pendingCount}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Pending</div>
          </div>
        </div>

        {/* AI Tagging Section */}
        {pendingCount > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            {isTagging ? (
              // Tagging in progress
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Analyzing games with AI...
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  This may take a few minutes for large libraries
                </p>
              </div>
            ) : taggingProgress ? (
              // Tagging complete
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Tagged {taggingProgress.successCount} of {taggingProgress.total} games!
                </p>
                {taggingProgress.failedCount > 0 && (
                  <p className="text-xs text-amber-500 mt-1">
                    {taggingProgress.failedCount} games couldn't be tagged
                  </p>
                )}
              </div>
            ) : (
              // Ready to tag
              <>
                <div className="flex items-start gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {pendingCount} games need AI setup
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      AI will analyze each game and assign Lutem attributes
                    </p>
                  </div>
                </div>
                
                {!aiConfigured ? (
                  <p className="text-xs text-red-500 mb-3">
                    ⚠️ AI tagging not configured on server
                  </p>
                ) : null}
                
                <button
                  onClick={handleTagPending}
                  disabled={!aiConfigured}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Set up {pendingCount} games
                </button>
                
                <p className="text-xs text-[var(--color-text-muted)] text-center mt-2 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{Math.ceil(pendingCount * 2 / 60)} min estimated
                </p>
              </>
            )}
          </div>
        )}

        {/* Last import info */}
        {lastImport && !taggingProgress && (
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
            Steam Profile URL or ID
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
            placeholder="https://steamcommunity.com/id/yourname"
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Help text */}
        {showHelp && (
          <div className="p-3 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 text-sm">
            <p className="text-[var(--color-text-secondary)] mb-2">
              <strong>Any of these formats work:</strong>
            </p>
            <ul className="space-y-1 text-[var(--color-text-muted)] text-xs">
              <li>• <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">https://steamcommunity.com/id/yourname</code></li>
              <li>• <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">https://steamcommunity.com/profiles/76561198...</code></li>
              <li>• Just your vanity name: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">yourname</code></li>
              <li>• Or 17-digit Steam ID: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">76561198012345678</code></li>
            </ul>
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
