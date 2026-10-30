import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Accent = 'navy' | 'teal' | 'amber' | 'violet';

const ACCENT_CLASSES: Record<Accent, string> = {
  navy: 'bg-deep text-teal-300',
  teal: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100',
};

export function QuickAccessCard({
  title,
  description,
  icon: Icon,
  to,
  accent = 'navy',
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  accent?: Accent;
}) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-surface p-5
        shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl
          ${ACCENT_CLASSES[accent]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-500">{description}</p>
      <span
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700
          opacity-70 transition group-hover:opacity-100"
      >
        Explore
        <ArrowRight
          className="h-4 w-4 transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
