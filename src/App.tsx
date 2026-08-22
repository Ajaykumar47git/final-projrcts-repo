import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardLayout } from './components/layout/DashboardLayout';
import PageTransition from './components/ui/PageTransition';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResidentDashboard from './pages/ResidentDashboard';
import ReportIssuePage from './pages/ReportIssuePage';
import IssueDetailsPage from './pages/IssueDetailsPage';
import ExploreIssuesPage from './pages/ExploreIssuesPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import NotificationsPage from './pages/NotificationsPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public pages — fade transition */}
            <Route path="/" element={<PublicLayout><PageTransition variant="fade"><LandingPage /></PageTransition></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><PageTransition variant="slide-up"><AboutPage /></PageTransition></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><PageTransition variant="slide-up"><HowItWorksPage /></PageTransition></PublicLayout>} />
            <Route path="/explore" element={<PublicLayout><PageTransition variant="fade"><ExploreIssuesPage /></PageTransition></PublicLayout>} />
            <Route path="/issues/:id" element={<PublicLayout><PageTransition variant="slide-left"><IssueDetailsPage /></PageTransition></PublicLayout>} />

            {/* Auth pages — scale transition */}
            <Route path="/login" element={<PageTransition variant="scale"><LoginPage /></PageTransition>} />
            <Route path="/signup" element={<PageTransition variant="scale"><SignupPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition variant="blur"><ForgotPasswordPage /></PageTransition>} />

            {/* Dashboard pages — slide-up transition */}
            <Route path="/dashboard" element={<DashboardLayout><PageTransition variant="slide-up"><ResidentDashboard /></PageTransition></DashboardLayout>} />
            <Route path="/my-reports" element={<DashboardLayout><PageTransition variant="slide-up"><ResidentDashboard /></PageTransition></DashboardLayout>} />
            <Route path="/report" element={<DashboardLayout><PageTransition variant="slide-left"><ReportIssuePage /></PageTransition></DashboardLayout>} />
            <Route path="/profile" element={<PageTransition variant="slide-up"><ProfilePage /></PageTransition>} />
            <Route path="/notifications" element={<PageTransition variant="fade"><NotificationsPage /></PageTransition>} />

            {/* Admin dashboard — fade transition */}
            <Route path="/admin" element={<PageTransition variant="fade"><AdminDashboard /></PageTransition>} />
            <Route path="/admin/reports" element={<PageTransition variant="fade"><AdminDashboard /></PageTransition>} />
            <Route path="/admin/departments" element={<PageTransition variant="fade"><AdminDashboard /></PageTransition>} />
            <Route path="/admin/analytics" element={<PageTransition variant="fade"><AdminDashboard /></PageTransition>} />
            <Route path="/admin/users" element={<PageTransition variant="fade"><AdminDashboard /></PageTransition>} />

            {/* Fallback */}
            <Route path="*" element={
              <PublicLayout>
                <PageTransition variant="scale">
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-navy-900 mb-2">404</h1>
                      <p className="text-navy-500 mb-6">Page not found</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  </div>
                </PageTransition>
              </PublicLayout>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
