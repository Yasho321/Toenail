import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set) => ({
  isProcessingPayment: false,
  
  plans: {
    standard: { amount: 250, tokens: 10, name: 'Standard' },
    premium: { amount: 600, tokens: 25, name: 'Premium' },
    pro: { amount: 1100, tokens: 50, name: 'Pro' },
  },

  createOrder: async (planName) => {
    try {
      set({ isProcessingPayment: true });
      const response = await axiosInstance.post('/payment/create-order', {
        planName
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      return null;
    } finally {
      set({ isProcessingPayment: false });
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      set({ isProcessingPayment: true });
      const response = await axiosInstance.post('/payment/verify', paymentData);
      
      if (response.data.success) {
        toast.success("Payment verified successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed");
      return false;
    } finally {
      set({ isProcessingPayment: false });
    }
  }
}));