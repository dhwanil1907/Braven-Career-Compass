import { useApp } from '../context/useApp';
import { scoreMatch } from '../lib/matchScore';
import type { CareerEvent, Resource } from '../types';
import { CompassDial } from './CompassDial';

/**
 * How well a listing fits the signed-in student, shown as quiet "91% match" text with the dial.
 * Renders nothing without onboarding answers or when the listing is below the cutoff.
 */
export function MatchBadge({ item }: { item: Resource | CareerEvent }) {
  const { profile } = useApp();
  const { label, percent } = scoreMatch(item, profile);
  if (label === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium text-teal-700"
      title={label}
    >
      <CompassDial percent={percent} size={14} />
      {percent}% match
    </span>
  );
}
