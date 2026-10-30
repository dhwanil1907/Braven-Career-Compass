import type { ReactNode } from 'react';

type BadgeVariant = 'navy' | 'teal' | 'slate' | 'amber' | 'outline';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  navy: 'bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100',
  teal: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100',
  slate: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200',
  amber: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200',
  outline: 'bg-surface text-slate-600 ring-1 ring-inset ring-slate-300',
};

export function Badge({
  children,
  variant = 'slate',
  className = '',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5
        text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span title="Fictional sample for prototype purposes" className="inline-flex">
      <Badge variant="amber">Demo data</Badge>
    </span>
  );
}
