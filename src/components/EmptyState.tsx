import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

/** Compact empty state: small icon, one line of context, one action. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-start gap-4 rounded-3xl bg-slate-100 dark:bg-surface
        px-6 py-7 sm:flex-row sm:items-center sm:gap-5"
    >
      <Icon className="h-7 w-7 shrink-0 text-slate-500" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-semibold text-navy-900">{title}</h3>
        <p className="mt-0.5 max-w-[65ch] text-sm text-slate-600">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
