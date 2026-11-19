import { useEffect, useState } from 'react';
import { Bookmark, Compass, LogOut, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { getEventById } from '../data/events';
import { getResourceById } from '../data/resources';

const NAV_LINKS = [
  { label: 'My journey', to: '/' },
  { label: 'Internships', to: '/internships' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Assistant', to: '/assistant' },
];

/** Signed-out visitors only have the landing page, so their tabs jump to its sections. */
const LANDING_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Explore', href: '/#explore' },
];

const SECTION_IDS = ['how-it-works', 'explore'];

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  const base = 'rounded-full border px-4 py-1.5 text-sm font-medium transition';
  return isActive
    ? `${base} border-teal-300 text-white`
    : `${base} border-transparent text-white/70 hover:text-white`;
}

export function Navbar() {
  const { pathname } = useLocation();
  const { savedResourceIds, savedEventIds } = useApp();
  const { user, hasAccess, signOut } = useAuth();
  const navLinks = hasAccess ? NAV_LINKS : [];
  const landingLinks = hasAccess ? [] : LANDING_LINKS;
  const [menuOpenForPath, setMenuOpenForPath] = useState<string | null>(null);
  const menuOpen = menuOpenForPath === pathname;
  // Which landing section is under the top bar; null means the hero.
  const [section, setSection] = useState<string | null>(null);
  const onLanding = !hasAccess && pathname === '/';

  useEffect(() => {
    if (!onLanding) return;
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      setSection(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [onLanding]);
  // Ignore stale IDs (e.g. items removed from the catalog) so the badge matches the dashboard.
  const savedCount =
    savedResourceIds.filter((id) => getResourceById(id) !== undefined).length +
    savedEventIds.filter((id) => getEventById(id) !== undefined).length;

  return (
    <header className="sticky top-0 z-40 bg-nav">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-4 px-4 sm:px-8
          lg:px-8"
      >
        <Link to="/" className="flex min-h-11 items-center gap-2.5 rounded-lg">
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
          {!hasAccess && (
            <li>
              <a href="/" className={navLinkClasses({ isActive: !onLanding || section === null })}>
                Home
              </a>
            </li>
          )}
          {landingLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={navLinkClasses({ isActive: `/#${section}` === link.href })}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {hasAccess && (
            <Link
              to="/#saved"
              aria-label={`Saved items: ${savedCount}`}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-coral-600 md:h-9 px-3.5
                text-sm font-semibold text-white transition hover:bg-coral-700"
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              <span>{savedCount}</span>
            </Link>
          )}
          {hasAccess ? (
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label={user ? `Sign out ${user.email ?? ''}` : 'Leave guest mode'}
              title={user ? `Sign out (${user.email ?? ''})` : 'Leave guest mode'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border
                border-white/20 md:h-9 md:w-9 text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-full bg-white px-4 md:h-9 text-sm
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
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white
              transition hover:bg-white/10 md:hidden`}
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
          <ul className="mx-auto flex max-w-[100rem] flex-col gap-1 px-4 py-3 sm:px-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpenForPath(null)}
                  className={(state) => `flex min-h-11 items-center ${navLinkClasses(state)}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {!hasAccess && (
              <li>
                <a
                  href="/"
                  onClick={() => setMenuOpenForPath(null)}
                  className={`flex min-h-11 items-center ${navLinkClasses({
                    isActive: !onLanding || section === null,
                  })}`}
                >
                  Home
                </a>
              </li>
            )}
            {landingLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpenForPath(null)}
                  className={`flex min-h-11 items-center ${navLinkClasses({
                    isActive: `/#${section}` === link.href,
                  })}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
