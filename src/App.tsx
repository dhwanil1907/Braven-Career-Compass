import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { AccountSync } from './components/AccountSync';
import { LoginPage } from './pages/LoginPage';
import { ProgressPage } from './pages/ProgressPage';
import { AlumniPage } from './pages/AlumniPage';
import { EventsPage } from './pages/EventsPage';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { useApp } from './context/useApp';
import { NotFoundPage } from './pages/NotFoundPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { ResourceExplorerPage } from './pages/ResourceExplorerPage';

/** Sign-in comes first: anyone without an account or guest choice is sent to /login. */
function RequireAccess({ children }: { children: ReactNode }) {
  const { hasAccess, loading } = useAuth();
  if (loading) return null;
  return hasAccess ? <>{children}</> : <Navigate to="/login" replace />;
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
          <Route
            element={
              <RequireAccess>
                <Layout />
              </RequireAccess>
            }
          >
            <Route index element={<HomeRoute />} />
            <Route path="start" element={<OnboardingPage />} />
            <Route path="resources" element={<ResourceExplorerPage />} />
            <Route path="resources/:id" element={<ResourceDetailPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="alumni" element={<AlumniPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="dashboard" element={<Navigate to="/progress" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
    </AuthProvider>
  );
}
