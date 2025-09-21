import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  isLoading: false,
  isCreatingChat: false,

  fetchChats: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/chat/');
      set({ chats: response.data.chat || [] });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to fetch chats");
    } finally {
      set({ isLoading: false });
    }
  },

  createChat: async () => {
    try {
      set({ isCreatingChat: true });
      const response = await axiosInstance.post('/chat/');
      const newChat = response.data.chat;
      
      set((state) => ({
        chats: [newChat, ...state.chats],
        currentChat: newChat
      }));
      
      toast.success("New chat created");
      return newChat;
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },

  setCurrentChat: (chat) => {
    set({ currentChat: chat });
  },

  updateChatTitle: (chatId, title) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === chatId ? { ...chat, title } : chat
      ),
      currentChat: state.currentChat?._id === chatId 
        ? { ...state.currentChat, title } 
        : state.currentChat
    }));
  },

  renameChat: async (chatId, newTitle) => {
    try {
      const response = await axiosInstance.put(`/chat/${chatId}`, {
        rename: newTitle
      });
      
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === chatId ? { ...chat, title: newTitle } : chat
        ),
        currentChat: state.currentChat?._id === chatId 
          ? { ...state.currentChat, title: newTitle } 
          : state.currentChat
      }));
      
      toast.success("Chat renamed successfully");
      return true;
    } catch (error) {
      console.error("Error renaming chat:", error);
      toast.error("Failed to rename chat");
      return false;
    }
  },

  deleteChat: async (chatId) => {
    try {
      await axiosInstance.delete(`/chat/${chatId}`);
      
      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
        currentChat: state.currentChat?._id === chatId ? null : state.currentChat
      }));
      
      toast.success("Chat deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
      return false;
    }
  }
}));