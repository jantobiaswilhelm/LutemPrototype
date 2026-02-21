import { useState } from 'react';
import { AllGamesContent } from '@/components/library/AllGamesContent';
import { MyGamesContent } from '@/components/library/MyGamesContent';

type LibraryTab = 'my-games' | 'all-games';

function TabSwitcher({
  activeTab,
  onTabChange
}: {
  activeTab: LibraryTab;
  onTabChange: (tab: LibraryTab) => void;
}) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <button
          onClick={() => onTabChange('my-games')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'my-games'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          My Games
        </button>
        <button
          onClick={() => onTabChange('all-games')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'all-games'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          All Games
        </button>
      </div>
    </div>
  );
}

export function Library() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('my-games');

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center mb-6">
          Library
        </h1>

        {/* Tab Switcher */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'my-games' ? <MyGamesContent /> : <AllGamesContent />}
      </div>
    </main>
  );
}

export default Library;
