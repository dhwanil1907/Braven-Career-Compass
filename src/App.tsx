import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
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
            <Route index element={<HomeRoute />} />
            <Route element={<RequireAccess />}>
              <Route path="start" element={<OnboardingPage />} />
              <Route path="resources" element={<ResourceExplorerPage />} />
              <Route path="resources/:id" element={<ResourceDetailPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="alumni" element={<AlumniPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="dashboard" element={<Navigate to="/progress" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
    </AuthProvider>
  );
}
