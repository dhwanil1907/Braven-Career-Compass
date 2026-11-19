import { useEffect } from 'react';

const SITE_NAME = 'Career Compass';

/** Sets document.title for the current route and restores the previous title on unmount. */
export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
