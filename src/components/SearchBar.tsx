import type { FormEvent } from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'What career resources are you looking for?',
  size = 'md',
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}) {
  const isLarge = size === 'lg';

  const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    onSubmit?.(value.trim());
  };

  const containerClasses = isLarge
    ? 'h-16 rounded-2xl pl-5 pr-2 shadow-card-hover'
    : 'h-12 rounded-xl pl-4 pr-1.5 shadow-card';

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex items-center gap-3 border border-slate-200 bg-surface transition
          focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100
          ${containerClasses}`}
      >
        <Search
          className={`shrink-0 text-slate-400 ${isLarge ? 'h-6 w-6' : 'h-5 w-5'}`}
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(changeEvent) => onChange(changeEvent.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={placeholder}
          className={`min-w-0 flex-1 bg-transparent text-navy-900 placeholder:text-slate-400
            focus:outline-none [&::-webkit-search-cancel-button]:hidden
            ${isLarge ? 'text-lg' : 'text-sm'}`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {onSubmit && (
          <button
            type="submit"
            className={`shrink-0 rounded-full bg-coral-600 font-semibold text-white transition
              hover:bg-deep ${isLarge ? 'h-12 px-6 text-base' : 'h-9 px-4 text-sm'}`}
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
