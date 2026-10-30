import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SkillGroup } from '../lib/skills';

export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <section aria-label="Skills to build">
      <h2 className="text-2xl font-semibold text-navy-900">Skills to build</h2>
      <p className="mt-1 flex items-start gap-2 text-sm text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        General guidance on skills often asked for in entry-level roles. Check real postings for
        exact requirements.
      </p>

      <div className="mt-6 space-y-8">
        {groups.map((group) => (
          <div key={group.interest}>
            <h3 className="text-base font-semibold text-teal-700">For {group.interest}</h3>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="flex flex-col rounded-2xl border border-slate-200/70 bg-surface p-5 shadow-card"
                >
                  <p className="font-semibold text-navy-900">{skill.name}</p>
                  <p className="mt-1 flex-1 text-sm text-slate-600">{skill.why}</p>
                  {skill.resourceCount > 0 ? (
                    <Link
                      to={`/resources?q=${encodeURIComponent(skill.searchTerm)}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700
                        hover:text-teal-800"
                    >
                      {skill.resourceCount} {skill.resourceCount === 1 ? 'resource' : 'resources'}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <p className="mt-4 text-xs text-slate-500">No catalog resources yet</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
