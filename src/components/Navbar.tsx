import { useState } from 'react';
import { Bookmark, Compass, LogOut, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { getEventById } from '../data/events';
import { getResourceById } from '../data/resources';

const NAV_LINKS = [
  { label: 'My journey', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'My progress', to: '/progress' },
];

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  const base = 'rounded-full border px-4 py-1.5 text-sm font-medium transition';
  return isActive
    ? `${base} border-teal-300 text-white`
    : `${base} border-transparent text-white/70 hover:text-white`;
}

export function Navbar() {
  const { pathname } = useLocation();
  const { savedResourceIds, savedEventIds, profile } = useApp();
  const { user, hasAccess, signOut } = useAuth();
  // Until a student has a plan, "/" is the landing page, so call it Home.
  const navLinks = NAV_LINKS.map((link) =>
    link.to === '/' && !profile.onboarded ? { ...link, label: 'Home' } : link,
  );
  const [menuOpenForPath, setMenuOpenForPath] = useState<string | null>(null);
  const menuOpen = menuOpenForPath === pathname;
  // Ignore stale IDs (e.g. items removed from the catalog) so the badge matches the dashboard.
  const savedCount =
    savedResourceIds.filter((id) => getResourceById(id) !== undefined).length +
    savedEventIds.filter((id) => getEventById(id) !== undefined).length;

  return (
    <header className="sticky top-0 z-40 bg-nav">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6
          lg:px-8"
      >
        <Link to="/" className="flex items-center gap-2.5 rounded-lg">
          <Compass className="h-6 w-6 text-coral-500" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
            Braven
          </span>
          <span className="hidden font-display text-lg text-teal-300 min-[400px]:inline">
            Career Compass
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === '/'} className={navLinkClasses}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/progress#saved"
            aria-label={`Saved items: ${savedCount}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-coral-600 px-3.5
              text-sm font-semibold text-white transition hover:bg-coral-700"
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            <span>{savedCount}</span>
          </Link>
          {hasAccess ? (
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label={user ? `Sign out ${user.email ?? ''}` : 'Leave guest mode'}
              title={user ? `Sign out (${user.email ?? ''})` : 'Leave guest mode'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border
                border-white/20 text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm
                font-semibold text-slate-900 transition hover:bg-white/90"
            >
              Sign in
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMenuOpenForPath(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white
              transition hover:bg-white/10 md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-white/10 bg-nav md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpenForPath(null)}
                  className={(state) => `block ${navLinkClasses(state)}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
