import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { NotificationProvider } from './context/NotificationContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { CacheProvider } from '@emotion/react';
import { theme, cacheRtl } from './theme';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

// Components
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Notifications from './components/pages/Notifications';
import NewTransaction from './components/pages/NewTransaction';
import TransactionDetails from './components/pages/TransactionDetails';
import Profile from './components/pages/Profile';
import Reports from './components/pages/Reports';
import UserManagement from './components/pages/admin/UserManagement';
import PermissionsManagement from './components/pages/admin/PermissionsManagement'; // Import the new component

// This component will contain the routes accessible within the main layout
const AppRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/transaction/new" element={<NewTransaction />} />
    <Route path="/transaction/edit/:id" element={<NewTransaction />} />
    <Route path="/transaction/:id" element={<TransactionDetails />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/admin/users" element={<UserManagement />} />
    <Route path="/admin/permissions" element={<PermissionsManagement />} />
    <Route path="/" element={<Navigate to="/dashboard" />} />
  </Routes>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              direction: 'rtl',
            },
          }}
        />
        <CssBaseline />
        <AlertProvider>
          <AuthProvider>
            <NotificationProvider>
              <WorkflowProvider>
                <Router>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <AppRoutes />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </ErrorBoundary>
                </Router>
              </WorkflowProvider>
            </NotificationProvider>
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
