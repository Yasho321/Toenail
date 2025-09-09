import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isLoggedOut: false,
  token: 0,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get('/auth/me');
      set({ 
        authUser: response.data.user,
        token: response.data.user.tokenBalance,
        isLoggedOut: false 
      });
    } catch (error) {
      console.error("check auth error:", error);
      set({ 
        authUser: null,
        isLoggedOut: true,
        token: 0
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateTokens: () => {
    set((state) => ({ token: state.token - 1 }));
  },

  addTokens: (value) => {
    set((state) => ({ token: state.token + value }));
  },

  setUser: (user) => {
    set({ 
      authUser: user,
      token: user.tokenBalance,
      isLoggedOut: false
    });
  }
}));