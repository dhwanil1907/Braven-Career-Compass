import { usePageTitle } from '../hooks/usePageTitle';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Briefcase, CalendarCheck, Compass, Info, Send } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SlidingToggle } from '../components/SlidingToggle';
import { useAuth } from '../context/useAuth';

type Mode = 'signin' | 'signup';

const MIN_PASSWORD_LENGTH = 6;

const INPUT_CLASS =
  'mt-2 h-12 w-full rounded-[1rem] border border-slate-300 bg-surface px-4 text-base ' +
  'text-navy-900 placeholder:text-slate-500 transition focus:border-ink';

function Brand({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex min-h-11 items-center gap-2.5 ${className}`}>
      <Compass className="h-6 w-6 text-coral-500" aria-hidden="true" />
      <span className="text-sm font-semibold uppercase tracking-[0.22em]">Braven</span>
      <span className="font-display text-lg text-teal-300">Career Compass</span>
    </Link>
  );
}

export function LoginPage() {
  usePageTitle('Sign in');
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

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section
        className="relative hidden flex-col justify-between overflow-hidden bg-deep p-12 text-deep-ink
          lg:flex"
      >
        <Brand className="text-white" />
        <div className="relative z-10 max-w-lg py-16">
          <h1
            className="font-display text-6xl font-bold leading-[0.98] tracking-[-0.04em]"
          >
            Find your next career move, faster.
          </h1>
          <p className="mt-6 text-lg text-deep-muted">
            Resources and events from Braven, the SJSU Career Center and student clubs, with a plan
            built around your major and goals.
          </p>
        </div>

        <div className="relative z-10 flex items-end gap-4" aria-hidden="true">
          <span className="flex h-28 w-28 -rotate-6 items-center justify-center rounded-[2rem] bg-teal-300 text-sky-ink shadow-card">
            <Briefcase className="h-11 w-11" />
          </span>
          <span className="mb-6 flex h-24 w-24 rotate-6 items-center justify-center rounded-[2rem] bg-sky-200 text-sky-ink shadow-card">
            <CalendarCheck className="h-10 w-10" />
          </span>
          <span className="flex h-28 w-28 -rotate-3 items-center justify-center rounded-[2rem] bg-coral-600 text-white shadow-card">
            <Send className="h-11 w-11" />
          </span>
        </div>

        <p className="relative z-10 mt-10 text-sm text-deep-muted">
          A student capstone prototype. Not an official Braven product.
        </p>
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-300/10"
          aria-hidden="true"
        />
      </section>

      <section className="flex flex-col bg-page">
        <div className="bg-nav px-4 lg:hidden">
          <Brand className="text-white" />
        </div>
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md">
            <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] text-navy-900 sm:text-5xl">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              {mode === 'signin'
                ? 'Sign in to pick up your plan and saved listings.'
                : 'Save your plan and pick it up on any device.'}
            </p>

            <SlidingToggle
              className="mt-8 w-full [&>button]:flex-1 [&>button]:justify-center"
              label="Account"
              value={mode}
              onChange={(next) => {
                setMode(next);
                setError(null);
              }}
              options={[
                { value: 'signin', label: 'Sign in' },
                { value: 'signup', label: 'Create account' },
              ]}
            />

            {!isConfigured && (
              <p className="mt-6 flex items-start gap-2 rounded-[1rem] bg-slate-100 p-4 text-sm text-navy-900 dark:bg-surface">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-ink" aria-hidden="true" />
                Accounts are not connected on this copy of the site yet. You can still continue as
                a guest below.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              <div>
                <label htmlFor="login-email" className="text-sm font-semibold text-navy-900">
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
                <label htmlFor="login-password" className="text-sm font-semibold text-navy-900">
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
                {mode === 'signup' && (
                  <p className="mt-2 text-sm text-slate-600">
                    At least {MIN_PASSWORD_LENGTH} characters.
                  </p>
                )}
              </div>

              {error && (
                <p role="alert" className="text-sm font-semibold text-coral-ink">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="text-sm font-semibold text-navy-900">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isConfigured || email.trim() === '' || password === ''}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full
                  bg-ink text-base font-semibold text-on-ink transition hover:opacity-85
                  disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
                {!submitting && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="h-px flex-1 bg-slate-300" />
              or
              <span className="h-px flex-1 bg-slate-300" />
            </div>

            <button
              type="button"
              onClick={() => {
                continueAsGuest();
                navigate('/', { replace: true });
              }}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-100
                text-base font-semibold text-navy-900 transition hover:bg-slate-200 dark:bg-surface
                dark:hover:bg-raised"
            >
              Continue as a guest
            </button>
            <p className="mt-5 text-sm text-slate-600">
              Guests keep their plan in this browser only. An account lets you pick up where you
              left off on another device.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
