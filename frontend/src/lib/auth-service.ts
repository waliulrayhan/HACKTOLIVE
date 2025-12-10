import api from './api-client';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  createdAt: string;
  student?: any;
  instructor?: any;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async signup(email: string, password: string, name: string, role?: string) {
    const response = await api.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
      role: role || 'STUDENT',
    });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async getProfile() {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; avatar?: string; bio?: string }) {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
