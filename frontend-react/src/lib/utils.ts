import { type ClassValue, clsx } from 'clsx';

// Simple class name merger (without tailwind-merge for now)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Get current time of day
export function getCurrentTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'MORNING';
  if (hour >= 12 && hour < 15) return 'MIDDAY';
  if (hour >= 15 && hour < 18) return 'AFTERNOON';
  if (hour >= 18 && hour < 24) return 'EVENING';
  return 'LATE_NIGHT';
}

// Format minutes to human readable
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}
