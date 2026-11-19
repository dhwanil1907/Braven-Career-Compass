import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';
import type { CareerEvent } from '../types';
import { showToast } from '../lib/toast';
import { TickBox } from './TickBox';

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
  if (new Date(event.start).getTime() <= Date.now()) return null;

  const checked = isReminderSet(event.id);
  const label = 'Email me a reminder';

  const handleChange = () => {
    toggleReminder(event.id);
    if (!checked) {
      showToast(
        `Reminder email sent to ${user?.email ?? 'your inbox'} for "${event.title}".`,
      );
    }
  };

  return (
    <>
      <label
        className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md text-sm text-slate-700
          has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2
          has-[:focus-visible]:outline-ink md:min-h-9 ${
          compact ? 'min-w-11 justify-center md:min-w-9' : ''
        }`}
        title={label}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onClick={(clickEvent) => clickEvent.stopPropagation()}
          className="sr-only"
        />
        <TickBox checked={checked} />
        <span className={compact ? 'sr-only' : ''}>{label}</span>
      </label>
    </>
  );
}
