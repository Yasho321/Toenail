import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  isLoading: false,
  isCreatingChat: false,

  fetchChats: async (getToken) => {
    try {
      set({ isLoading: true });
      const token = await getToken();
      const response = await axiosInstance.get('/chat/',{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },});
      set({ chats: response.data.chat || [] });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to fetch chats");
    } finally {
      set({ isLoading: false });
    }
  },

  createChat: async (getToken) => {
    try {
      set({ isCreatingChat: true });
      const token = await getToken();
      const response = await axiosInstance.post('/chat/', {},{
        headers: {
          Authorization: `Bearer ${token}`, 
           'Content-Type': 'application/json',
          // Attach token
        },});
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
      const token = await getToken();
      const response = await axiosInstance.put(`/chat/${chatId}`, {
        rename: newTitle
      },{
        headers: {
          Authorization: `Bearer ${token}`, 
           'Content-Type': 'application/json',
          // Attach token
        },});
      
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
      const token = await getToken();
      await axiosInstance.delete(`/chat/${chatId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },});
      
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