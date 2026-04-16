import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const usersService = {
  async getUsers(params: Record<string, any> = {}) {
    const response = await axios.get(`${API_URL}/users`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  async getUserById(id: string) {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async createUser(data: any) {
    const response = await axios.post(`${API_URL}/users`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateUser(id: string, data: any) {
    const response = await axios.put(`${API_URL}/users/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getProfile() {
    const response = await axios.get(`${API_URL}/users/me`, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await axios.put(`${API_URL}/users/me`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getStats() {
    const response = await axios.get(`${API_URL}/users/stats`, {
      withCredentials: true,
    });
    return response.data;
  },
};
