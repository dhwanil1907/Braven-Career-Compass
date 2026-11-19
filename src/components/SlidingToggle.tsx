import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface Option<T extends string> {
  value: T;
  label: ReactNode;
}

/** Pill-shaped switcher whose dark indicator glides to the selected option. */
export function SlidingToggle<T extends string>({
  label,
  options,
  value,
  onChange,
  className = '',
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const buttons = useRef(new Map<T, HTMLButtonElement>());
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const button = buttons.current.get(value);
      if (button) setBox({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [value, options]);

  return (
    <div
      role="group"
      aria-label={label}
      className={`relative inline-flex rounded-full bg-slate-100 p-1 dark:bg-surface ${className}`}
    >
      {box && (
        <span
          aria-hidden="true"
          className="absolute bottom-1 top-1 rounded-full bg-ink transition-[left,width]
            duration-300 ease-[cubic-bezier(0.3,0.9,0.3,1)]"
          style={{ left: box.left, width: box.width }}
        />
      )}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              if (element) buttons.current.set(option.value, element);
              else buttons.current.delete(option.value);
            }}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm
              font-semibold transition-colors duration-200 focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-ink ${
                selected ? 'text-on-ink' : 'text-slate-700 hover:text-navy-900'
              }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
