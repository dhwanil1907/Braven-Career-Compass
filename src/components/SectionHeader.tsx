import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-3xl tracking-tight text-navy-900">
          {title}
        </h2>
        <span className="mt-3 block h-1 w-12 bg-sky-300" aria-hidden="true" />
        {subtitle && <p className="mt-3 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold
            text-coral-600 underline decoration-2 underline-offset-4 transition
            hover:text-navy-900"
        >
          {action.label}
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
