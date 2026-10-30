import { useEffect, useState } from 'react';
import type { SaveCounts } from '../lib/featured';
import { supabase } from '../lib/supabase';

/**
 * Real save counts from students' accounts, for the "Popular" tab. Returns an empty object when
 * accounts are not set up, the view has not been created, or nobody has saved anything yet; the
 * tab then shows its empty state instead of invented numbers.
 */
export function useSaveCounts(): SaveCounts {
  const [counts, setCounts] = useState<SaveCounts>({});

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from('save_counts')
      .select('item_id, saves')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn(`Save counts are off (could not read "save_counts"): ${error.message}`);
          return;
        }
        const next: SaveCounts = {};
        for (const row of data ?? []) {
          if (typeof row.item_id === 'string' && typeof row.saves === 'number') {
            next[row.item_id] = row.saves;
          }
        }
        setCounts(next);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}
