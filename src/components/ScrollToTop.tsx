import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HASH_RETRY_MS = 50;
const HASH_RETRY_LIMIT = 20;

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (!hash) {
      scrollToTop();
      return;
    }

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // Malformed escape sequence in the URL; fall back to the raw fragment.
    }
    const scrollToTarget = () => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return Boolean(target);
    };
    if (scrollToTarget()) return;

    // Pages load lazily, so the target may not be in the DOM yet; keep looking briefly.
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (scrollToTarget()) {
        window.clearInterval(timer);
      } else if (attempts >= HASH_RETRY_LIMIT) {
        window.clearInterval(timer);
        scrollToTop();
      }
    }, HASH_RETRY_MS);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
}
