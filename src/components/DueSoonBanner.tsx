import { useMemo } from 'react';
import { BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { formatDate, relativeDayLabel } from '../lib/dates';
import { getDueSoon } from '../lib/progress';

/** A reminder inside the app for saved items that are due or start within a week. */
export function DueSoonBanner() {
  const { savedResourceIds, savedEventIds, appliedResourceIds } = useApp();

  const items = useMemo(
    () =>
      getDueSoon(
        resources.filter((resource) => savedResourceIds.includes(resource.id)),
        events.filter((event) => savedEventIds.includes(event.id)),
        appliedResourceIds,
      ),
    [savedResourceIds, savedEventIds, appliedResourceIds],
  );

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="Due soon"
      className="rounded-xl border border-coral-600 bg-surface p-4 shadow-card"
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
        <BellRing className="h-4 w-4 text-coral-600" aria-hidden="true" />
        Due in the next 7 days ({items.length})
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={`${item.kind}-${item.id}`}>
            <Link
              to={item.href}
              className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-navy-900 hover:underline"
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-slate-600">
                {item.label} {formatDate(item.when.toISOString())} (
                {relativeDayLabel(item.when.toISOString())})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
