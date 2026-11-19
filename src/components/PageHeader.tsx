import type { ReactNode } from 'react';

/**
 * Calm, slim title bar for inner pages. The loud lime treatment lives only on the landing page.
 * `eyebrow` is accepted for backwards compatibility but is no longer rendered.
 */
export function PageHeader({
  title,
  description,
  children,
}: {
  /** @deprecated No longer rendered. */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 bg-surface">
      <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-[2rem]">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-[70ch] text-base text-slate-600">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </header>
  );
}
