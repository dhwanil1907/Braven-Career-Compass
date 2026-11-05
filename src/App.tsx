import { Suspense, lazy, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { AccountSync } from './components/AccountSync';
import { LoginPage } from './pages/LoginPage';
import { useApp } from './context/useApp';

const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const AlumniPage = lazy(() => import('./pages/AlumniPage').then((m) => ({ default: m.AlumniPage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const JourneyPage = lazy(() => import('./pages/JourneyPage').then((m) => ({ default: m.JourneyPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage').then((m) => ({ default: m.ResourceDetailPage })));
const ResourceExplorerPage = lazy(() => import('./pages/ResourceExplorerPage').then((m) => ({ default: m.ResourceExplorerPage })));

/** Placeholder bars shown in the page area while a route chunk loads. */
function PageSkeleton() {
  return (
    <div
      className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading page"
    >
      <div className="animate-pulse space-y-5 motion-reduce:animate-none">
        <div className="h-10 w-2/3 max-w-xl rounded bg-slate-200" />
        <div className="h-5 w-1/2 max-w-md rounded bg-slate-200" />
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-40 rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Keeps the navbar/footer in place while a route chunk loads. */
function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

/** The landing page is public; every other page needs an account or guest choice. */
function RequireAccess() {
  const { hasAccess, loading } = useAuth();
  if (loading) return null;
  return hasAccess ? <Outlet /> : <Navigate to="/login" replace />;
}

/** New visitors see the landing page; once onboarded, "/" is their personal journey. */
function HomeRoute() {
  const { profile } = useApp();
  return profile.onboarded ? <JourneyPage /> : <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
    <AppProvider>
      <AccountSync />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route index element={<Page><HomeRoute /></Page>} />
            <Route element={<RequireAccess />}>
              <Route path="start" element={<Page><OnboardingPage /></Page>} />
              <Route path="resources" element={<Page><ResourceExplorerPage /></Page>} />
              <Route path="resources/:id" element={<Page><ResourceDetailPage /></Page>} />
              <Route path="events" element={<Page><EventsPage /></Page>} />
              <Route path="alumni" element={<Page><AlumniPage /></Page>} />
              <Route path="progress" element={<Page><ProgressPage /></Page>} />
              <Route path="dashboard" element={<Navigate to="/progress" replace />} />
              <Route path="*" element={<Page><NotFoundPage /></Page>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
    </AuthProvider>
  );
}
