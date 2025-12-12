import api from './api-client';
import { User } from './auth-service';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateSocialLinksDto {
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
}

export const userService = {
  async getProfile() {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileDto) {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  async updateSocialLinks(data: UpdateSocialLinksDto) {
    const response = await api.patch<User>('/auth/profile/social-links', data);
    return response.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<User>('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  async getUserById(id: string) {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

export default userService;
