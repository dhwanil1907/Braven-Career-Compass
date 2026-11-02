import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

type Mode = 'signin' | 'signup';

const MIN_PASSWORD_LENGTH = 6;

const INPUT_CLASS =
  'mt-1.5 h-12 w-full rounded-lg border border-slate-300 bg-surface px-3.5 text-base ' +
  'text-navy-900 placeholder:text-slate-400 focus:border-navy-900 focus:outline-none ' +
  'focus:ring-4 focus:ring-sky-300/50';

export function LoginPage() {
  const navigate = useNavigate();
  const { hasAccess, loading, isConfigured, signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && hasAccess) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use a password with at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setSubmitting(true);
    const result =
      mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else if (result.needsConfirmation) {
      setNotice('Account created. Check your email for a confirmation link, then sign in.');
      setMode('signin');
      setPassword('');
    } else {
      navigate('/', { replace: true });
    }
  };

  const tabClass = (value: Mode) =>
    `flex-1 border-b-2 pb-3 text-sm font-semibold transition ${
      mode === value
        ? 'border-coral-600 text-navy-900'
        : 'border-transparent text-slate-500 hover:text-navy-900'
    }`;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative flex flex-col justify-between bg-hero p-8 text-navy-950 sm:p-12">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.3em]">
            BRAVEN <span className="ml-1 tracking-normal text-coral-600">Career Compass</span>
          </p>
        </div>
        <div className="py-16">
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
            Find your next career move, faster.
          </h1>
          <span className="mt-5 block h-1 w-12 bg-sky-300" aria-hidden="true" />
          <p className="mt-5 max-w-md text-lg text-navy-800">
            Resources and events from Braven and the SJSU Career Center, with a plan built around
            your major and goals.
          </p>
        </div>
        <p className="text-sm text-navy-800">
          A student capstone prototype. Not an official Braven product.
        </p>
      </section>

      <section className="flex flex-col justify-center bg-surface px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div role="tablist" aria-label="Account" className="flex gap-4 border-b border-slate-200">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={tabClass('signin')}
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={tabClass('signup')}
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
            >
              Create account
            </button>
          </div>

          {!isConfigured && (
            <p className="mt-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Accounts are not connected on this copy of the site yet. You can still continue as a
              guest below.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="text-sm font-medium text-navy-900">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-medium text-navy-900">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="text-sm font-medium text-navy-800">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !isConfigured || email.trim() === '' || password === ''}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full
                bg-coral-600 text-base font-semibold text-white transition hover:bg-deep
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              {!submitting && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                continueAsGuest();
                navigate('/', { replace: true });
              }}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border
                border-navy-900 text-base font-semibold text-navy-900 transition hover:bg-navy-50"
            >
              Continue as a guest
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Guests keep their plan in this browser only. An account lets you pick up where you left off on another device.
          </p>
        </div>
      </section>
    </div>
  );
}
