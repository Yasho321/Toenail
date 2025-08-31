import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChatId: null,
  isCreatingChat: false,
  isLoadingChats: false,

  createChat: async () => {
    set({ isCreatingChat: true });
    try {
      const res = await axiosInstance.post("/chat/");
      const newChat = res.data.chat;
      set((state) => ({ 
        chats: [newChat, ...state.chats],
        currentChatId: newChat._id
      }));
      toast.success("New chat created");
      return newChat._id;
    } catch (error) {
      console.log("Error creating chat", error);
      toast.error("Error creating chat");
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },

  fetchChats: async () => {
    set({ isLoadingChats: true });
    try {
      const res = await axiosInstance.get("/chat/");
      const chats = res.data.chat || [];
      set({ chats });
      
      // Set current chat to first chat if none selected
      if (chats.length > 0 && !get().currentChatId) {
        set({ currentChatId: chats[0]._id });
      }
    } catch (error) {
      console.log("Error fetching chats", error);
      toast.error("Error fetching chats");
    } finally {
      set({ isLoadingChats: false });
    }
  },

  setCurrentChat: (chatId) => {
    set({ currentChatId: chatId });
  },

  updateChatTitle: (chatId, title) => {
    set((state) => ({
      chats: state.chats.map(chat => 
        chat._id === chatId ? { ...chat, title } : chat
      )
    }));
  }
}));