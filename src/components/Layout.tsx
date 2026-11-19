import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { ScrollToTop } from './ScrollToTop';
import { Toaster } from './Toaster';

export function Layout() {
  // The chat fills the screen, so it has no footer.
  const showFooter = useLocation().pathname !== '/assistant';
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <ScrollToTop />
      <Toaster />
    </div>
  );
}
