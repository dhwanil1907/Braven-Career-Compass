import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

const TILES = [
  'left-0 top-12 h-36 w-36 rotate-[-8deg] bg-teal-300 text-sky-ink',
  'left-40 top-0 h-32 w-32 rotate-[7deg] bg-sky-200 text-sky-ink',
  'left-24 top-40 h-32 w-32 rotate-[5deg] bg-coral-600 text-white',
];

/**
 * Big headline hero shared by the inner pages. `icons` adds up to three tilted tiles on wide
 * screens; they are decorative.
 */
export function PageHeader({
  title,
  description,
  icons,
  children,
}: {
  title: string;
  description?: ReactNode;
  icons?: LucideIcon[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden xl:min-h-[22rem]">
      <div className="mx-auto max-w-[100rem] px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-16 lg:px-16">
        <h1
          className="max-w-[18ch] font-display text-[clamp(2.75rem,7vw,5rem)] font-semibold
            leading-[0.95] tracking-[-0.04em] text-navy-900"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-[52ch] text-lg text-slate-600 sm:text-xl">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
      {icons && icons.length > 0 && (
        <div
          className="pointer-events-none absolute right-16 top-10 hidden h-72 w-[26rem] xl:block"
          aria-hidden="true"
        >
          {icons.slice(0, TILES.length).map((Icon, index) => (
            <span
              key={index}
              className={`absolute flex items-center justify-center rounded-[2rem] shadow-card ${TILES[index]}`}
            >
              <Icon className="h-11 w-11" />
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
