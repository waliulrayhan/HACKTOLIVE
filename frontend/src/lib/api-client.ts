import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-logout for:
      // 1. Login failures (wrong credentials)
      // 2. Signup failures
      // 3. Password change failures (wrong old password)
      const isLoginError = error.config?.url?.includes('/auth/login');
      const isSignupError = error.config?.url?.includes('/auth/signup');
      const isPasswordChangeError = error.config?.url?.includes('/auth/change-password');
      
      if (!isLoginError && !isSignupError && !isPasswordChangeError) {
        // Clear token and redirect to login for other 401 errors (expired token, etc.)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
