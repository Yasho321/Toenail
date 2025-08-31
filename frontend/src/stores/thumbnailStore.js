import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useThumbnailStore = create((set, get) => ({
  messages: [],
  isLoadingMessages: false,
  isCreatingThumbnail: false,
  isDownloading: false,

  fetchMessages: async (chatId) => {
    if (!chatId) return;
    
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get(`/thumbnail/${chatId}`);
      const messages = res.data.chatMessages?.[0]?.messages || [];
      set({ messages });
    } catch (error) {
      console.log("Error fetching messages", error);
      if (error.response?.status !== 404) {
        toast.error("Error fetching messages");
      }
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  createThumbnail: async (chatId, formData) => {
    set({ isCreatingThumbnail: true });
    try {
      const res = await axiosInstance.post(`/thumbnail/${chatId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const newMessage = res.data.response;
      const allMessages = res.data.chatMessages.messages;
      
      set({ messages: allMessages });
      toast.success("Thumbnail created successfully!");
      
      return newMessage;
    } catch (error) {
      console.log("Error creating thumbnail", error);
      toast.error(error.response?.data?.message || "Error creating thumbnail");
      return null;
    } finally {
      set({ isCreatingThumbnail: false });
    }
  },

  downloadImages: async (imageUrls) => {
    set({ isDownloading: true });
    try {
      const res = await axiosInstance.post('/download/download-zip', {
        imageUrls
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'thumbnails.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Images downloaded successfully!");
    } catch (error) {
      console.log("Error downloading images", error);
      toast.error("Error downloading images");
    } finally {
      set({ isDownloading: false });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));