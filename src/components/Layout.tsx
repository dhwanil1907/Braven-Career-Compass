import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { ScrollToTop } from './ScrollToTop';

const ChatWidget = lazy(() =>
  import('./ChatWidget').then((module) => ({ default: module.ChatWidget })),
);

const IDLE_DELAY_MS = 1500;

export function Layout() {
  const [chatReady, setChatReady] = useState(false);

  // Keep the chat code out of the critical path: mount it once the page has settled.
  useEffect(() => {
    const timer = window.setTimeout(() => setChatReady(true), IDLE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      {chatReady && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
}
