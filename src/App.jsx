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

// Components
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Notifications from './components/pages/Notifications';
import NewTransaction from './components/pages/NewTransaction';
import TransactionDetails from './components/pages/TransactionDetails';
import Profile from './components/pages/Profile';

// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


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
  return (
    <ErrorBoundary>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AuthProvider>
              <AlertProvider>
                <NotificationProvider>
                  <WorkflowProvider>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Navigate to="/dashboard" />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Notifications />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/transactions/new"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <NewTransaction />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/transactions/:id"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <TransactionDetails />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Profile />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </WorkflowProvider>
                </NotificationProvider>
              </AlertProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default App;
