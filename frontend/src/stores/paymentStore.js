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

  createOrder: async (planName ,getToken) => {
    try {
      set({ isProcessingPayment: true });
      const token = await getToken();
      const response = await axiosInstance.post('/payment/create-order', {
        planName
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },});
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      return null;
    } finally {
      set({ isProcessingPayment: false });
    }
  },

  verifyPayment: async (paymentData,getToken) => {
    try {
      set({ isProcessingPayment: true });
      const token = getToken();
      const response = await axiosInstance.post('/payment/verify', paymentData,{
         headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });
      
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