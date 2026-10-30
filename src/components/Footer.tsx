import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'My Journey', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'My Progress', to: '/progress' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep text-[#cdc9b9]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5 rounded-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-deep-2">
                <Compass className="h-5 w-5 text-teal-300" aria-hidden="true" />
              </span>
              <span className="text-base font-bold text-white">
                Braven <span className="text-teal-300">Career Compass</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-[#8f8c82]">
              One place to discover jobs, internships, workshops, and career events — matched
              to your major and interests.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="rounded transition hover:text-teal-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-deep-2 pt-6 text-xs text-[#8f8c82]">
          <p className="max-w-3xl leading-relaxed">
            Braven Career Compass is a student capstone prototype and is not an official product
            of Braven, San José State University, or Handshake. Listings can change; always
            confirm details on the official source.
          </p>
          <p className="mt-3">© {year} Braven Career Compass</p>
        </div>
      </div>
    </footer>
  );
}
