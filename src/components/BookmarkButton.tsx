import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Bookmark } from 'lucide-react';
import { useApp } from '../context/useApp';
import { showToast } from '../lib/toast';

export function BookmarkButton({
  kind,
  id,
  withLabel = false,
  className = '',
}: {
  kind: 'resource' | 'event';
  id: string;
  withLabel?: boolean;
  className?: string;
}) {
  const { isResourceSaved, isEventSaved, toggleResource, toggleEvent } = useApp();
  const saved = kind === 'resource' ? isResourceSaved(id) : isEventSaved(id);
  // Pop only when the student taps it, not when a saved card first renders.
  const [popped, setPopped] = useState(false);

  const handleClick = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    setPopped(true);
    showToast(saved ? 'Removed from saved' : 'Saved. Find it in My journey.');
    if (kind === 'resource') {
      toggleResource(id);
    } else {
      toggleEvent(id);
    }
  };

  const stateClasses = saved
    ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100'
    : 'border-slate-200 bg-surface text-slate-500 hover:border-navy-200 hover:text-navy-800';
  const sizeClasses = withLabel ? 'h-11 gap-2 px-4 text-sm font-medium md:h-10' : 'h-11 w-11 justify-center md:h-9 md:w-9';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save'}
      title={saved ? 'Remove from saved' : 'Save'}
      className={`inline-flex shrink-0 items-center rounded-full border transition
        ${stateClasses} ${sizeClasses} ${className}`}
    >
      <Bookmark
        key={String(saved)}
        className={`h-4 w-4 ${saved ? 'fill-current' : ''} ${popped ? 'animate-pop' : ''}`}
        aria-hidden="true"
      />
      {withLabel && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
