import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import TestsList from './components/tests/TestsList';
import TestCreateForm from './components/tests/TestCreateForm';
import ReadingTestEditor from './components/tests/ReadingTestEditor';
import ListeningTestEditor from './components/tests/ListeningTestEditor';
import WritingTestEditor from './components/tests/WritingTestEditor';
import SpeakingTestEditor from './components/tests/SpeakingTestEditor';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Placeholder components for future implementation
const ReadingTestsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Reading Tests</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const ListeningTestsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Listening Tests</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const WritingTestsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Writing Tests</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const SpeakingTestsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Speaking Tests</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const UsersPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">User Management</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const ExaminerPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Examiner Panel</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const ProfilePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tests" element={<TestsList />} />
                <Route path="tests/create" element={<TestCreateForm />} />
                <Route path="tests/:testId/reading" element={<ReadingTestEditor />} />
                <Route path="tests/:testId/listening" element={<ListeningTestEditor />} />
                <Route path="tests/:testId/writing" element={<WritingTestEditor />} />
                <Route path="tests/:testId/speaking" element={<SpeakingTestEditor />} />
                <Route path="tests/reading" element={<ReadingTestsPage />} />
                <Route path="tests/listening" element={<ListeningTestsPage />} />
                <Route path="tests/writing" element={<WritingTestsPage />} />
                <Route path="tests/speaking" element={<SpeakingTestsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="examiner" element={<ExaminerPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
                error: {
                  duration: 4000,
                  theme: {
                    primary: '#f56565',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 