import type { Professional } from '../data/professionals';

export type KindFilter = 'all' | Professional['kind'];

export interface ProfessionalFilters {
  query: string;
  company: string;
  kind: KindFilter;
}

export function filterProfessionals(
  list: readonly Professional[],
  { query, company, kind }: ProfessionalFilters,
): Professional[] {
  const needle = query.trim().toLowerCase();
  return list.filter((person) => {
    if (company !== '' && person.company !== company) return false;
    if (kind !== 'all' && person.kind !== kind) return false;
    if (needle === '') return true;
    return [person.name, person.company, person.role].some((field) =>
      field.toLowerCase().includes(needle),
    );
  });
}

export function companiesWithCounts(
  list: readonly Professional[],
): { company: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const person of list) {
    counts.set(person.company, (counts.get(person.company) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count || a.company.localeCompare(b.company));
}

export function initialsOf(name: string): string {
  const words = name
    .replace(/\([^)]*\)/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((word) => word !== '');
  if (words.length === 0) return '?';
  const letters =
    words.length === 1 ? words[0][0] : words[0][0] + words[words.length - 1][0];
  return letters.toUpperCase();
}
