import type { ApplicationRecord, ApplicationStatus, Resource } from '../types';

export interface ApplicationRow {
  resource: Resource;
  appliedAt: string | null;
  status: ApplicationStatus;
}

/** Rows for every applied id that still exists in `resources`, newest application first. */
export function buildApplicationRows(
  resources: Resource[],
  appliedIds: string[],
  applications: Record<string, ApplicationRecord>,
): ApplicationRow[] {
  const byId = new Map(resources.map((resource) => [resource.id, resource]));
  const rows: ApplicationRow[] = [];
  for (const id of appliedIds) {
    const resource = byId.get(id);
    if (!resource) continue;
    const record = applications[id];
    rows.push({
      resource,
      appliedAt: record?.appliedAt ?? null,
      status: record?.status ?? 'Applied',
    });
  }
  return rows.sort((a, b) => {
    if (a.appliedAt && b.appliedAt) {
      const diff = new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      if (diff !== 0) return diff;
    } else if (a.appliedAt || b.appliedAt) {
      return a.appliedAt ? -1 : 1;
    }
    return a.resource.title.localeCompare(b.resource.title);
  });
}
