import { ChevronDown } from 'lucide-react';

export function FilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  groups,
  onChange,
  allLabel = 'All',
}: {
  id: string;
  label: string;
  value: T | '';
  options: readonly T[];
  /** When given, options render under group headings instead of as a flat list. */
  groups?: readonly { label: string; options: readonly T[] }[];
  onChange: (value: T | '') => void;
  allLabel?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(changeEvent) => onChange(changeEvent.target.value as T | '')}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200
            bg-surface pl-3.5 pr-10 text-sm text-navy-900 shadow-card transition
            hover:border-slate-300 focus:border-teal-400 focus:outline-none focus:ring-4
            focus:ring-teal-100"
        >
          <option value="">{allLabel}</option>
          {groups
            ? groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </optgroup>
              ))
            : options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2
            text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
