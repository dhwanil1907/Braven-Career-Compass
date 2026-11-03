import { Sparkles } from 'lucide-react';
import { useApp } from '../context/useApp';
import { scoreMatch } from '../lib/matchScore';
import type { CareerEvent, Resource } from '../types';
import { Badge } from './Badge';

/**
 * How well a listing fits the signed-in student, for example "Slightly matches what you do · 25%".
 * Renders nothing without onboarding answers or when the listing is below the cutoff.
 */
export function MatchBadge({ item }: { item: Resource | CareerEvent }) {
  const { profile } = useApp();
  const { label, percent } = scoreMatch(item, profile);
  if (label === null) return null;

  return (
    <Badge variant="teal">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {label} · {percent}%
    </Badge>
  );
}
