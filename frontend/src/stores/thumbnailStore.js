import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useThumbnailStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isGenerating: false,

  fetchMessages: async (chatId,getToken) => {
    try {
      set({ isLoading: true });
      const token = await getToken();
      const response = await axiosInstance.get(`/thumbnail/${chatId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },});
      set({ messages: response.data.chatMessages || [] });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isLoading: false });
    }
  },

  generateThumbnail: async (chatId, formData,getToken) => {
    try {
      set({ isGenerating: true });
      const token = await  getToken();
      const response = await axiosInstance.post(`/thumbnail/${chatId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`

        },
      });
      
      set({ messages: [response.data.chatMessages] });
      toast.success("Thumbnail generated successfully!");
      return response.data.response;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      toast.error(error.response?.data?.message || "Failed to generate thumbnail");
      return null;
    } finally {
      set({ isGenerating: false });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));