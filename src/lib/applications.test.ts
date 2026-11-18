import { describe, expect, it } from 'vitest';
import type { ApplicationRecord, Resource } from '../types';
import { buildApplicationRows } from './applications';

const make = (id: string, title: string) => ({ id, title }) as Resource;
const pool = [make('a', 'Alpha'), make('b', 'Beta'), make('c', 'Gamma')];

describe('buildApplicationRows', () => {
  it('orders newest first, undated last then by title', () => {
    const applications: Record<string, ApplicationRecord> = {
      a: { appliedAt: '2026-01-01T00:00:00.000Z', status: 'Applied' },
      c: { appliedAt: '2026-03-01T00:00:00.000Z', status: 'Offer' },
    };
    const rows = buildApplicationRows(pool, ['b', 'a', 'c'], applications);
    expect(rows.map((row) => row.resource.id)).toEqual(['c', 'a', 'b']);
    expect(rows[0].status).toBe('Offer');
  });

  it('falls back to Applied with no date when the record is missing', () => {
    const [row] = buildApplicationRows(pool, ['b'], {});
    expect(row.appliedAt).toBeNull();
    expect(row.status).toBe('Applied');
  });

  it('sorts undated rows by title', () => {
    const rows = buildApplicationRows(pool, ['c', 'a'], {});
    expect(rows.map((row) => row.resource.title)).toEqual(['Alpha', 'Gamma']);
  });

  it('ignores ids that are not in resources', () => {
    expect(buildApplicationRows(pool, ['zzz', 'a'], {}).map((row) => row.resource.id)).toEqual([
      'a',
    ]);
  });
});
