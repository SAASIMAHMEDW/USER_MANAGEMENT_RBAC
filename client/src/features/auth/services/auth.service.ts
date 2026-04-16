import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      data,
      { withCredentials: true }
    );
    return response.data;
  },

  async logout() {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  async refresh() {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },
};
