import { ArrowLeft, Compass, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-2xl" aria-hidden="true" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-deep to-deep-2 text-teal-300 shadow-card">
          <Compass className="h-12 w-12" aria-hidden="true" />
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-800">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
        Looks like you&apos;ve wandered off the map
      </h1>
      <p className="mt-4 max-w-md text-base text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get your
        career search back on course.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-coral-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-surface px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:border-teal-300 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Explore resources
        </Link>
      </div>
    </div>
  );
}
