import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, Link } from 'react-router-dom';
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
import { ArrowLeft, Clock, BookOpen, Headphones, PenTool, Mic } from 'lucide-react';
import { testsAPI } from './services/api';
import { useQuery } from 'react-query';

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

// Test View Component
const TestView = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { data: test, isLoading, error } = useQuery(
    ['test', testId],
    () => testsAPI.getById(testId),
    {
      enabled: !!testId,
      retry: 1,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error || !test?.data?.data?.test) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Test Not Found</h2>
          <p className="text-gray-600 mb-4">The test you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/tests')}
            className="btn btn-primary"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const testData = test.data.data.test;

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/tests')}
          className="btn btn-ghost mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.title}</h1>
              <p className="text-gray-600">{testData.description}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                testData.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : testData.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {testData.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                testData.difficulty === 'beginner'
                  ? 'bg-blue-100 text-blue-800'
                  : testData.difficulty === 'intermediate'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {testData.difficulty}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Total Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{testData.totalTime} min</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Reading</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {testData.reading?.sections?.length || 0} sections
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Listening</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {testData.listening?.sections?.length || 0} sections
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Writing</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {testData.writing?.tasks?.length || 0} tasks
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Test Sections</h3>
            <div className="space-y-3">
              {testData.reading?.sections?.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Reading Test</h4>
                      <p className="text-sm text-blue-700">
                        {testData.reading.sections.length} sections, {testData.reading.totalTime} minutes
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/tests/${testData._id}/reading`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                </div>
              )}
              
              {testData.listening?.sections?.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Headphones className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Listening Test</h4>
                      <p className="text-sm text-green-700">
                        {testData.listening.sections.length} sections, {testData.listening.totalTime} minutes
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/tests/${testData._id}/listening`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                </div>
              )}
              
              {testData.writing?.tasks?.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <PenTool className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-purple-900">Writing Test</h4>
                      <p className="text-sm text-purple-700">
                        {testData.writing.tasks.length} tasks, {testData.writing.totalTime} minutes
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/tests/${testData._id}/writing`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                </div>
              )}
              
              {testData.speaking?.parts?.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-900">Speaking Test</h4>
                      <p className="text-sm text-orange-700">
                        {testData.speaking.parts.length} parts, {testData.speaking.totalTime} minutes
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/tests/${testData._id}/speaking`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
                <Route path="tests/:testId" element={<TestView />} />
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