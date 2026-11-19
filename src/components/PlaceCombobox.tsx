import { useEffect, useId, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { placeLabel, suggestPlaces } from '../lib/places';
import type { PlaceOption } from '../lib/places';

/** Location search box: suggestions appear and narrow as the student types. */
export function PlaceCombobox({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  /** Chosen place value, or '' for anywhere. */
  value: string;
  options: PlaceOption[];
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(() => placeLabel(options, value));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Keep the box in step when the filter is cleared or set from outside.
  useEffect(() => {
    setText(placeLabel(options, value));
  }, [value, options]);

  const suggestions = suggestPlaces(options, text === placeLabel(options, value) ? '' : text);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) {
        setOpen(false);
        setText(placeLabel(options, value));
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open, options, value]);

  const choose = (option: PlaceOption) => {
    onChange(option.value);
    setText(option.label);
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setText('');
    setActive(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && open && suggestions[active]) {
      event.preventDefault();
      choose(suggestions[active]);
    } else if (event.key === 'Escape') {
      setOpen(false);
      setText(placeLabel(options, value));
    }
  };

  return (
    <div ref={root} className="relative flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && suggestions[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={text}
          placeholder="Anywhere, or type a city or state"
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
            setActive(0);
            if (event.target.value === '' && value !== '') onChange('');
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-surface pl-10 pr-10 text-base
            text-navy-900 placeholder:text-slate-500"
        />
        {(text !== '' || value !== '') && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear location"
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center
              justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-navy-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-2xl
            border border-slate-200 bg-surface p-1.5 shadow-lg"
        >
          {suggestions.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(option);
              }}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl
                px-3 text-base ${
                  index === active ? 'bg-ink text-on-ink' : 'text-navy-900 hover:bg-slate-100'
                }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate font-medium">{option.label}</span>
                {option.kind === 'region' && (
                  <span className="shrink-0 text-sm opacity-70">whole state</span>
                )}
              </span>
              <span className="shrink-0 text-sm opacity-70">{option.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
