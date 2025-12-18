'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const token = authService.getToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        try {
          // Verify token is still valid
          await authService.verifyToken();
          setUser(savedUser);
        } catch (error) {
          console.error('Token verification failed:', error);
          authService.clearAuth();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      authService.setToken(data.token);
      authService.setUser(data.user);
      setUser(data.user);

      // Redirect based on role
      switch (data.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'INSTRUCTOR':
          router.push('/instructor/dashboard');
          break;
        case 'STUDENT':
        default:
          router.push('/student/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role?: string) => {
    try {
      const data = await authService.signup(name, email, password, role);
      authService.setToken(data.token);
      authService.setUser(data.user);
      setUser(data.user);

      // Redirect based on role
      switch (data.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'INSTRUCTOR':
          router.push('/instructor/dashboard');
          break;
        case 'STUDENT':
        default:
          router.push('/student/dashboard');
          break;
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    // Merge with existing user data to preserve all fields
    const mergedUser = user ? { ...user, ...updatedUser } : updatedUser;
    authService.setUser(mergedUser);
    setUser(mergedUser);
  };

  const setUserAndStore = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      authService.setUser(newUser);
    }
  };

  const setTokenAndStore = (token: string) => {
    authService.setToken(token);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isLoading: loading, 
      login, 
      signup, 
      logout, 
      updateUser,
      setUser: setUserAndStore,
      setToken: setTokenAndStore
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
