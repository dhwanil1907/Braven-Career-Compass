import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';
import type { CareerEvent } from '../types';

const TOAST_MS = 2500;

/** Demo tickbox: ticking shows a confirmation that a reminder email was sent. No email is sent. */
export function ReminderCheckbox({
  event,
  compact = false,
}: {
  event: CareerEvent;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const { isReminderSet, toggleReminder } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (new Date(event.start).getTime() <= Date.now()) return null;

  const checked = isReminderSet(event.id);
  const label = 'Email me a reminder';

  const handleChange = () => {
    toggleReminder(event.id);
    if (!checked) {
      setToast(
        `Reminder email sent to ${user?.email ?? 'your inbox'} for "${event.title}".`,
      );
    }
  };

  return (
    <>
      <label
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700"
        title={label}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onClick={(clickEvent) => clickEvent.stopPropagation()}
          className="h-4 w-4 rounded border-slate-300 accent-teal-600"
        />
        <span className={compact ? 'sr-only' : ''}>{label}</span>
      </label>
      {toast &&
        createPortal(
          <div
            role="status"
            className="fixed left-1/2 top-[4.75rem] z-[60] max-w-[90vw] animate-toast-flow
            rounded-xl bg-deep px-5 py-3 text-sm font-medium text-white shadow-card-hover
            motion-reduce:-translate-x-1/2 motion-reduce:animate-none"
          >
            {toast}
          </div>,
          document.body,
        )}
    </>
  );
}
