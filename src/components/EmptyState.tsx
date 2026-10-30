import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

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
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
        border-slate-200 bg-surface/60 px-6 py-12 text-center"
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50
          text-navy-600"
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
