import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { subscribeToasts } from '../lib/toast';
import type { ToastMessage } from '../lib/toast';

/** Matches the length of the `toast-flow` animation in index.css. */
const TOAST_MS = 2500;

/** Shows the latest toast under the top bar. Render it once, in the page layout. */
export function Toaster() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => subscribeToasts(setToast), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return createPortal(
    <div aria-live="polite" role="status">
      {toast && (
        <div
          // A new id restarts the animation when a second toast replaces the first.
          key={toast.id}
          className="fixed left-1/2 top-[4.75rem] z-[60] flex max-w-[90vw] animate-toast-flow items-center
            gap-2.5 rounded-full bg-deep px-5 py-3 text-sm font-semibold text-white shadow-lg
            motion-reduce:-translate-x-1/2 motion-reduce:animate-none"
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-300 text-sky-ink"
            aria-hidden="true"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {toast.message}
        </div>
      )}
    </div>,
    document.body,
  );
}
