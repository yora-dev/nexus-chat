import { create } from 'zustand';
import API from '../utils/axios';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nexus_user')) || null,
  token: localStorage.getItem('nexus_token') || null,
  isAuthenticated: !!localStorage.getItem('nexus_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await API.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (name, username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await API.post('/auth/register', { name, username, email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));