import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  Test, 
  TestSubmission, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  me: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

// Test API
export const testApi = {
  getTests: async (params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    skills?: string[];
    search?: string;
  }): Promise<PaginatedResponse<Test>> => {
    const response = await api.get('/tests', { params });
    return response.data;
  },

  getTest: async (testId: string): Promise<ApiResponse<Test>> => {
    const response = await api.get(`/tests/${testId}`);
    return response.data;
  },

  getFeaturedTests: async (): Promise<ApiResponse<Test[]>> => {
    const response = await api.get('/tests/featured');
    return response.data;
  },

  getPopularTests: async (): Promise<ApiResponse<Test[]>> => {
    const response = await api.get('/tests/popular');
    return response.data;
  },

  startTest: async (testId: string): Promise<ApiResponse<TestSubmission>> => {
    const response = await api.post(`/tests/${testId}/start`);
    return response.data;
  },

  saveProgress: async (submissionId: string, data: {
    answers: Record<string, any>;
    currentSection?: number;
    currentQuestion?: number;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/submissions/${submissionId}/progress`, data);
    return response.data;
  },

  submitTest: async (submissionId: string, data: {
    answers: Record<string, any>;
  }): Promise<ApiResponse<TestSubmission>> => {
    const response = await api.post(`/submissions/${submissionId}/submit`, data);
    return response.data;
  },

  getSubmission: async (submissionId: string): Promise<ApiResponse<TestSubmission>> => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  },
};

// User submissions API
export const submissionApi = {
  getMySubmissions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    testId?: string;
  }): Promise<PaginatedResponse<TestSubmission>> => {
    const response = await api.get('/submissions/my', { params });
    return response.data;
  },

  getSubmissionDetails: async (submissionId: string): Promise<ApiResponse<TestSubmission>> => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  },

  deleteSubmission: async (submissionId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/submissions/${submissionId}`);
    return response.data;
  },
};

// Statistics API
export const statsApi = {
  getDashboardStats: async (): Promise<ApiResponse<{
    totalTests: number;
    completedTests: number;
    averageScore: number;
    recentActivity: any[];
    progressChart: any[];
    skillBreakdown: any[];
  }>> => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  getProgressStats: async (timeRange?: string): Promise<ApiResponse<{
    progressChart: any[];
    skillProgress: any[];
    compareData: any[];
  }>> => {
    const response = await api.get('/stats/progress', { 
      params: { timeRange } 
    });
    return response.data;
  },

  getLeaderboard: async (params?: {
    skill?: string;
    timeRange?: string;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/stats/leaderboard', { params });
    return response.data;
  },
};

// File upload API
export const uploadApi = {
  uploadAvatar: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadAudio: async (file: File, type: 'speaking' | 'listening'): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('type', type);
    
    const response = await api.post('/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  handleApiError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.join(', ');
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  isNetworkError: (error: any): boolean => {
    return !error.response && error.code === 'ECONNABORTED';
  },

  isServerError: (error: any): boolean => {
    return error.response?.status >= 500;
  },

  isClientError: (error: any): boolean => {
    return error.response?.status >= 400 && error.response?.status < 500;
  },
};

// Export the main api instance for custom requests
export default api;
