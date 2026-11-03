import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface OptionGroup {
  label: string;
  options: readonly string[];
}

function summary(selected: string[], allLabel: string): string {
  if (selected.length === 0) return allLabel;
  if (selected.length === 1) return selected[0];
  return `${selected.length} selected`;
}

/** A dropdown of checkboxes; an empty selection means "no filter". */
export function MultiFilterSelect({
  label,
  selected,
  groups,
  onChange,
  allLabel = 'All',
}: {
  label: string;
  selected: string[];
  groups: readonly OptionGroup[];
  onChange: (selected: string[]) => void;
  allLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const currentValue = summary(selected, allLabel);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );

  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500" aria-hidden="true">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${label}: ${currentValue}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-11 w-full items-center rounded-xl border border-slate-200
          bg-surface pl-3.5 pr-10 text-left text-sm text-navy-900 shadow-card transition
          hover:border-slate-300 focus:border-teal-400 focus:outline-none focus:ring-4
          focus:ring-teal-100"
      >
        <span className="truncate">{currentValue}</span>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2
            text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl
            border border-slate-200 bg-surface p-2 shadow-card-hover"
        >
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mb-1 w-full rounded-lg px-2.5 py-1.5 text-left text-sm font-medium
                text-teal-700 transition hover:bg-slate-100"
            >
              Clear selection
            </button>
          )}
          {groups.map((group) =>
            group.options.length === 0 ? null : (
              <fieldset key={group.label} className="py-1">
                <legend
                  className="px-2.5 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide
                    text-slate-500"
                >
                  {group.label}
                </legend>
                {group.options.map((option) => {
                  const checked = selected.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2
                        text-sm text-navy-900 transition hover:bg-slate-100"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(option)}
                        className="peer sr-only"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border
                          transition peer-focus-visible:ring-4 peer-focus-visible:ring-teal-100 ${
                            checked
                              ? 'border-teal-600 bg-teal-600 text-white'
                              : 'border-slate-300 bg-surface'
                          }`}
                        aria-hidden="true"
                      >
                        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      {option}
                    </label>
                  );
                })}
              </fieldset>
            ),
          )}
        </div>
      )}
    </div>
  );
}
