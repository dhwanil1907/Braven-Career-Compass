const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns an ISO date-time string `days` from today at the given local time. */
export function daysFromNow(days: number, hour = 12, minute = 0, now = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`;
}

export function daysUntil(iso: string, now = new Date()): number {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(iso);
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  ).getTime();
  return Math.round((startOfTarget - startOfToday) / DAY_MS);
}

export function relativeDayLabel(iso: string, now = new Date()): string {
  const days = daysUntil(iso, now);
  if (days < 0) return 'Passed';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

export function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
