import { useMemo } from 'react';
import { ClipboardList, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { resources } from '../data/resources';
import { APPLICATION_STATUSES } from '../data/taxonomy';
import { buildApplicationRows } from '../lib/applications';
import { formatDate } from '../lib/dates';
import type { ApplicationStatus } from '../types';
import { EmptyState } from './EmptyState';

const headClass = 'px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600';

export function ApplicationTracker() {
  const { appliedResourceIds, applications, setApplicationStatus, toggleApplied } = useApp();
  const rows = useMemo(
    () => buildApplicationRows(resources, appliedResourceIds, applications),
    [appliedResourceIds, applications],
  );

  return (
    <section id="tracker" className="scroll-mt-24" aria-labelledby="tracker-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="tracker-heading"
            className="font-display text-3xl font-semibold tracking-[-0.03em] text-navy-900 sm:text-4xl"
          >
            Application tracker
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Internships and jobs you marked as applied, saved on this device.
          </p>
        </div>
        <span className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-on-ink">
          {rows.length} {rows.length === 1 ? 'application' : 'applications'}
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description={'Click "I applied" on an internship or job and it will be added here.'}
          action={
            <Link
              to="/internships"
              className="inline-flex min-h-11 items-center gap-1 rounded-full bg-coral-600 px-4 py-2
                text-sm font-semibold text-white transition hover:bg-coral-700"
            >
              Browse internships
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-slate-100 dark:bg-surface">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Internships and jobs you have applied to</caption>
            <thead className="border-b border-slate-300/70">
              <tr>
                <th scope="col" className={headClass}>
                  Role
                </th>
                <th scope="col" className={headClass}>
                  Applied
                </th>
                <th scope="col" className={headClass}>
                  Status
                </th>
                <th scope="col" className={headClass}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300/70">
              {rows.map(({ resource, appliedAt, status }) => (
                <tr key={resource.id} className="transition hover:bg-black/[0.03] dark:hover:bg-white/[0.03]">
                  <th scope="row" className="px-5 py-5 align-top font-normal">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-lg font-semibold tracking-[-0.01em] text-navy-900 underline-offset-2 hover:underline"
                    >
                      {resource.title}
                    </a>
                    <p className="mt-0.5 text-slate-600">{resource.summary}</p>
                  </th>
                  <td className="whitespace-nowrap px-5 py-5 align-top text-slate-700">
                    {appliedAt ? formatDate(appliedAt) : '—'}
                  </td>
                  <td className="px-5 py-5 align-top">
                    <select
                      aria-label={`Status for ${resource.title}`}
                      value={status}
                      onChange={(event) =>
                        setApplicationStatus(resource.id, event.target.value as ApplicationStatus)
                      }
                      className="h-10 rounded-full border border-slate-300 bg-surface px-4 text-sm font-medium
                        text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-teal-500"
                    >
                      {APPLICATION_STATUSES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-5 text-right align-top">
                    <button
                      type="button"
                      onClick={() => toggleApplied(resource.id)}
                      aria-label={`Remove ${resource.title} from tracker`}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-300
                        px-4 text-sm font-medium text-slate-600 transition
                        hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
