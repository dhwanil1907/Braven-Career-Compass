import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';

const SAVE_DELAY_MS = 1000;
const TABLE = 'user_data';

/**
 * Keeps a signed-in student's profile, saved items and progress in their Supabase account so
 * they follow them across devices. Renders nothing. Guests are never synced.
 *
 * On sign-in the account's copy replaces what is in the browser; if the account has no copy yet,
 * the browser's data is uploaded. Needs supabase/schema.sql to have been run once.
 */
export function AccountSync() {
  const { user } = useAuth();
  const {
    profile,
    savedResourceIds,
    savedEventIds,
    reminderEventIds,
    completedStepIds,
    attendedEventIds,
    appliedResourceIds,
    referralSource,
    restoreFromAccount,
  } = useApp();

  const userId = user?.id ?? null;
  // The user id whose account copy has been loaded; saving waits for this to match.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const lastSaved = useRef<string>('');
  const warned = useRef(false);

  const snapshot = JSON.stringify({
    profile,
    savedResourceIds,
    savedEventIds,
    reminderEventIds,
    completedStepIds,
    attendedEventIds,
    appliedResourceIds,
    referralSource,
  });

  // Load the account's copy once per sign-in.
  useEffect(() => {
    if (!supabase || !userId) {
      setLoadedFor(null);
      return;
    }
    let cancelled = false;
    supabase
      .from(TABLE)
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          if (!warned.current) {
            warned.current = true;
            console.warn(`Account sync is off (could not read "${TABLE}"): ${error.message}`);
          }
          return;
        }
        const stored = data?.data as Record<string, unknown> | undefined;
        if (stored && Object.keys(stored).length > 0) {
          restoreFromAccount(stored);
          lastSaved.current = JSON.stringify(stored);
        }
        setLoadedFor(userId);
      });
    return () => {
      cancelled = true;
    };
    // restoreFromAccount is stable; reloading when it changes would overwrite local edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Save changes shortly after they stop.
  useEffect(() => {
    if (!supabase || !userId || loadedFor !== userId) return;
    if (snapshot === lastSaved.current) return;
    const timer = window.setTimeout(() => {
      supabase
        ?.from(TABLE)
        .upsert({
          user_id: userId,
          data: JSON.parse(snapshot) as unknown,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) {
            console.warn(`Account sync could not save to "${TABLE}": ${error.message}`);
            return;
          }
          lastSaved.current = snapshot;
        });
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [snapshot, userId, loadedFor]);

  return null;
}
