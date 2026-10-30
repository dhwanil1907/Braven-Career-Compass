import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'theme';

function applyTheme(isDark: boolean): void {
  document.documentElement.classList.toggle('dark', isDark);
  try {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  } catch (error) {
    console.warn('Could not persist theme preference', { isDark, error });
  }
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const handleToggle = () => {
    const next = !isDark;
    applyTheme(next);
    setIsDark(next);
  };

  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border
        border-white/25 text-white transition hover:border-white hover:bg-white/10"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
