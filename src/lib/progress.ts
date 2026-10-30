import type { CareerEvent, Resource } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

/** Start of the Sunday-based week containing the date, matching the calendar view. */
function weekStartMs(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()).getTime();
}

/**
 * Consecutive weeks (ending this week, or last week if this week has none yet) in which the
 * student attended at least one event. Based on the event's own date. Last week still counts so a
 * streak is not lost before the current week is over.
 */
export function attendedWeekStreak(attended: CareerEvent[], now: Date = new Date()): number {
  const weeks = new Set(attended.map((event) => weekStartMs(new Date(event.start))));
  const thisWeek = weekStartMs(now);
  let cursor = weeks.has(thisWeek) ? thisWeek : thisWeek - WEEK_MS;
  let streak = 0;
  while (weeks.has(cursor)) {
    streak += 1;
    cursor -= WEEK_MS;
  }
  return streak;
}

export interface Badge {
  id: string;
  label: string;
  /** What earns it, shown while it is still locked. */
  hint: string;
  earned: boolean;
}

export function getBadges(attendedCount: number, appliedCount: number): Badge[] {
  return [
    { id: 'first-event', label: 'First event', hint: 'Attend one event', earned: attendedCount >= 1 },
    { id: 'three-events', label: 'Three events', hint: 'Attend three events', earned: attendedCount >= 3 },
    {
      id: 'first-application',
      label: 'First application',
      hint: 'Mark one resource as applied',
      earned: appliedCount >= 1,
    },
  ];
}

export interface DueSoonItem {
  kind: 'resource' | 'event';
  id: string;
  title: string;
  /** "Deadline", "Registration closes" or "Starts" */
  label: string;
  when: Date;
  href: string;
}

/**
 * Saved items whose deadline, registration deadline or start falls within the next few days.
 * Applied resources are skipped, because the student has already acted on them.
 */
export function getDueSoon(
  savedResources: Resource[],
  savedEvents: CareerEvent[],
  appliedResourceIds: string[],
  now: Date = new Date(),
  windowDays = 7,
): DueSoonItem[] {
  const nowMs = now.getTime();
  const endMs = nowMs + windowDays * DAY_MS;
  const inWindow = (date: Date) => date.getTime() >= nowMs && date.getTime() <= endMs;
  const items: DueSoonItem[] = [];

  for (const resource of savedResources) {
    if (!resource.deadline || appliedResourceIds.includes(resource.id)) continue;
    const when = new Date(resource.deadline);
    if (inWindow(when)) {
      items.push({
        kind: 'resource',
        id: resource.id,
        title: resource.title,
        label: 'Deadline',
        when,
        href: `/resources/${resource.id}`,
      });
    }
  }

  for (const event of savedEvents) {
    const closes = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
    const starts = new Date(event.start);
    const href = `/events?event=${event.id}`;
    if (closes && inWindow(closes)) {
      items.push({
        kind: 'event',
        id: event.id,
        title: event.title,
        label: 'Registration closes',
        when: closes,
        href,
      });
    } else if (inWindow(starts)) {
      items.push({
        kind: 'event',
        id: event.id,
        title: event.title,
        label: 'Starts',
        when: starts,
        href,
      });
    }
  }

  return items.sort((first, second) => first.when.getTime() - second.when.getTime());
}
