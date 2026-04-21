import { useState } from 'react';
import { AllGamesContent } from '@/components/library/AllGamesContent';
import { MyGamesContent } from '@/components/library/MyGamesContent';

type LibraryTab = 'my-games' | 'all-games';

const TABS: { id: LibraryTab; label: string; numeral: string }[] = [
  { id: 'my-games',  label: 'My games',  numeral: 'i.'  },
  { id: 'all-games', label: 'All games', numeral: 'ii.' },
];

function TabSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: LibraryTab;
  onTabChange: (tab: LibraryTab) => void;
}) {
  return (
    <nav
      aria-label="Library sections"
      className="flex flex-wrap items-baseline gap-x-10 gap-y-4 mb-10"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className="library-tab relative group font-serif text-[1.15rem] leading-none bg-transparent border-0 p-0 pb-3 cursor-pointer transition-colors duration-300 inline-flex items-baseline gap-2"
            style={{
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontStyle: isActive ? 'italic' : 'normal',
            }}
          >
            <span
              className="font-mono text-[0.62rem] tracking-[0.22em] uppercase opacity-70"
              style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
            >
              {tab.numeral}
            </span>
            {tab.label}
            <span
              aria-hidden="true"
              className="absolute left-0 -bottom-px h-px transition-[right,background] duration-500"
              style={{
                right: isActive ? '0' : '100%',
                background: 'var(--color-accent)',
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}

export function Library() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('my-games');
  const activeLabel = TABS.find((t) => t.id === activeTab)?.label.toLowerCase() ?? '';

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 pt-8 pb-24">

        {/* ─── masthead ────────────────────────────────── */}
        <header
          className="pb-6 mb-10"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="flex items-center gap-3 mb-5 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-7 h-px"
              style={{ background: 'var(--color-accent)' }}
            />
            The Library
          </div>

          <h1
            className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] m-0"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Library
            <span style={{ color: 'var(--color-text-muted)' }}>, </span>
            <em
              className="font-serif italic"
              style={{ color: 'var(--color-accent)' }}
            >
              {activeLabel}
            </em>
            <span style={{ color: 'var(--color-accent)' }}>.</span>
          </h1>

          <p
            className="font-serif italic text-[clamp(1rem,1.3vw,1.15rem)] leading-snug mt-4 max-w-[48ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {activeTab === 'my-games'
              ? 'Your own collection — imported, catalogued, and read for the mood.'
              : 'The full register of titles Lutem consults when composing a recommendation.'}
          </p>
        </header>

        {/* ─── tab switcher ────────────────────────────── */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ─── content ─────────────────────────────────── */}
        {activeTab === 'my-games' ? <MyGamesContent /> : <AllGamesContent />}
      </div>
    </main>
  );
}

export default Library;
