import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
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
      set({ authUser: null, isLoggedOut: true });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      localStorage.setItem('token', res.data.token);
      set({ 
        authUser: res.data.user, 
        isLoggedOut: false,
        token: res.data.user.tokenBalance 
      });
      toast.success("Account created successfully! 3 demo tokens credited");
      return true;
    } catch (error) {
      console.log("Error signing up", error);
      toast.error(error.response?.data?.message || "Error signing up");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem('token', res.data.token);
      set({ 
        authUser: res.data.user, 
        isLoggedOut: false,
        token: res.data.user.tokenBalance 
      });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      console.log("Error logging in", error);
      toast.error(error.response?.data?.message || "Error logging in");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ isCheckingAuth: true });
      await axiosInstance.get("/auth/logout");
      localStorage.removeItem('token');
      set({ 
        authUser: null, 
        isLoggedOut: true, 
        token: 0 
      });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateTokens: () => {
    set((state) => ({ token: state.token - 1 }));
  },

  addTokens: (value) => {
    set((state) => ({ token: state.token + value }));
  }
}));