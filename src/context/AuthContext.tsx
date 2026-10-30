import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { isAuthConfigured, supabase } from '../lib/supabase';

export interface AuthResult {
  /** Plain-language message to show the student, or null on success. */
  error: string | null;
  /** True when sign-up worked but the email must be confirmed before signing in. */
  needsConfirmation?: boolean;
}

export interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  /** True while the saved session is being restored; avoids a flash of the login page. */
  loading: boolean;
  /** Signed in or browsing as a guest. */
  hasAccess: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_CONFIGURED = 'Sign-in is not set up on this copy of the site yet. Continue as a guest.';

function friendlyError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'That email and password do not match.';
  if (/already registered|already been registered/i.test(message)) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (/email address.*invalid|invalid.*email/i.test(message)) {
    return 'That email address was not accepted. Use a real email address you can open.';
  }
  if (/rate limit|too many/i.test(message)) {
    return 'Too many attempts. Wait a few minutes and try again.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email first. Check your inbox for the link.';
  }
  if (/password/i.test(message)) return message;
  return 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isAuthConfigured);
  const [isGuest, setIsGuest] = useLocalStorage<boolean>(
    'bcc:guest',
    false,
    (value) => typeof value === 'boolean',
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setUser(data.session?.user ?? null);
      })
      .catch((error: unknown) => {
        console.warn('Auth: could not restore session:', error instanceof Error ? error.message : error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { error: NOT_CONFIGURED };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: friendlyError(error.message) };
      setIsGuest(false);
      return { error: null };
    },
    [setIsGuest],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { error: NOT_CONFIGURED };
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: friendlyError(error.message) };
      setIsGuest(false);
      // With email confirmation on, Supabase returns a user but no session.
      return { error: null, needsConfirmation: data.session === null };
    },
    [setIsGuest],
  );

  const continueAsGuest = useCallback(() => setIsGuest(true), [setIsGuest]);

  const signOut = useCallback(async () => {
    const hadAccount = user !== null;
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Auth: sign-out failed:', error.message);
    }
    setUser(null);
    setIsGuest(false);
    if (hadAccount) {
      // The account's copy lives in Supabase. Clear this browser's copy so the next person on
      // this computer does not inherit it (or upload it to their own account), then reload.
      try {
        Object.keys(window.localStorage)
          .filter((key) => key.startsWith('bcc:'))
          .forEach((key) => window.localStorage.removeItem(key));
      } catch (error) {
        console.warn('Auth: could not clear local data:', error instanceof Error ? error.message : error);
      }
      window.location.assign('/login');
    }
  }, [user, setIsGuest]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isGuest,
      loading,
      hasAccess: user !== null || isGuest,
      isConfigured: isAuthConfigured,
      signIn,
      signUp,
      continueAsGuest,
      signOut,
    }),
    [user, isGuest, loading, signIn, signUp, continueAsGuest, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
