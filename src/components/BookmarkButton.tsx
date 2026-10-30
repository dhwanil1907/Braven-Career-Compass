import type { MouseEvent } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/useApp';

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
  const Icon = saved ? BookmarkCheck : Bookmark;

  const handleClick = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    if (kind === 'resource') {
      toggleResource(id);
    } else {
      toggleEvent(id);
    }
  };

  const stateClasses = saved
    ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100'
    : 'border-slate-200 bg-surface text-slate-500 hover:border-navy-200 hover:text-navy-800';
  const sizeClasses = withLabel ? 'h-10 gap-2 px-4 text-sm font-medium' : 'h-9 w-9 justify-center';

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
      <Icon className="h-4 w-4" aria-hidden="true" />
      {withLabel && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
