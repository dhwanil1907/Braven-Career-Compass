import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RoadmapStep } from '../types';

interface RoadmapListProps {
  steps: RoadmapStep[];
  completedIds: string[];
  onToggle(id: string): void;
}

export function RoadmapList({ steps, completedIds, onToggle }: RoadmapListProps) {
  const nextId = steps.find((step) => !completedIds.includes(step.id))?.id;

  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const done = completedIds.includes(step.id);
        const isNext = step.id === nextId;
        return (
          <li
            key={step.id}
            className={`flex items-start gap-3 rounded-xl border p-4 transition ${
              isNext
                ? 'border-teal-300 bg-teal-50'
                : 'border-slate-200/70 bg-surface'
            }`}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={done}
              aria-label={`Mark "${step.title}" ${done ? 'not done' : 'done'}`}
              onClick={() => onToggle(step.id)}
              className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                border-2 transition ${
                  done
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-slate-300 bg-surface text-transparent hover:border-teal-600'
                }`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Step {index + 1}
                {isNext && <span className="ml-2 text-teal-700">Next</span>}
              </p>
              <p
                className={`mt-0.5 font-semibold text-navy-900 ${done ? 'line-through opacity-60' : ''}`}
              >
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{step.why}</p>
              <Link
                to={step.href}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700
                  hover:text-teal-800"
              >
                <span className="line-clamp-1">{step.actionLabel}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
