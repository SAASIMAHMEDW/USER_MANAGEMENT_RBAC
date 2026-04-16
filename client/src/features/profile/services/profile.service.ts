import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const profileService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/users/me`, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateProfile(data: { name?: string; currentPassword?: string; newPassword?: string }) {
    const response = await axios.put(`${API_URL}/users/me`, data, {
      withCredentials: true,
    });
    return response.data;
  },
};
