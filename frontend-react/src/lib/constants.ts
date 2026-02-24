import type { DiscoveryMode } from '@/lib/recommendationDefaults';

export const GENRE_LIST = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Simulation',
  'Platformer', 'Racing', 'Sports', 'Horror', 'Card Game', 'Roguelike',
  'Party Game', 'Sandbox', 'Survival', 'Shooter', 'Indie', 'Fighting',
];

export const DISCOVERY_OPTIONS: { value: DiscoveryMode; label: string }[] = [
  { value: 'popular', label: 'Popular picks' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'hidden_gems', label: 'Hidden gems' },
];
