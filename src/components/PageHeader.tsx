import type { ReactNode } from 'react';

/**
 * Shared opening band for inner pages. Matches the lime hero on the landing page and My Journey
 * so every page starts the same way.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="bg-hero text-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-800">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
        <span className="mt-4 block h-1 w-12 bg-sky-300" aria-hidden="true" />
        {description && <p className="mt-4 max-w-2xl text-lg text-navy-800">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
