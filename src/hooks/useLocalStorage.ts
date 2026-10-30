import { useCallback, useEffect, useState } from 'react';

function readStoredValue<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => boolean,
): T {
  if (typeof window === 'undefined') return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initialValue;
    const parsed: unknown = JSON.parse(raw);
    if (!isValid(parsed)) {
      console.warn(`useLocalStorage: ignoring stored value for key "${key}" with unexpected shape`);
      return initialValue;
    }
    return parsed as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`useLocalStorage: failed to read key "${key}": ${message}`);
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => boolean = () => true,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => readStoredValue(key, initialValue, isValid));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`useLocalStorage: failed to write key "${key}": ${message}`);
    }
  }, [key, storedValue]);

  useEffect(() => {
    function handleStorage(event: StorageEvent): void {
      if (event.storageArea !== window.localStorage || event.key !== key) return;
      if (event.newValue === null) {
        setStoredValue(initialValue);
        return;
      }
      try {
        const parsed: unknown = JSON.parse(event.newValue);
        if (isValid(parsed)) setStoredValue(parsed as T);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`useLocalStorage: failed to sync key "${key}" from another tab: ${message}`);
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // initialValue is intentionally excluded: callers often pass fresh literals each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback((value: T | ((previous: T) => T)) => {
    setStoredValue((previous) =>
      typeof value === 'function' ? (value as (previous: T) => T)(previous) : value,
    );
  }, []);

  return [storedValue, setValue];
}
