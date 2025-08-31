import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set, get) => ({
  isCreatingOrder: false,
  isVerifyingPayment: false,

  createOrder: async (planName) => {
    set({ isCreatingOrder: true });
    try {
      const res = await axiosInstance.post('/payment/create-order', { planName });
      return res.data;
    } catch (error) {
      console.log("Error creating order", error);
      toast.error("Error creating payment order");
      return null;
    } finally {
      set({ isCreatingOrder: false });
    }
  },

  verifyPayment: async (paymentData) => {
    set({ isVerifyingPayment: true });
    try {
      const res = await axiosInstance.post('/payment/verify-payment', paymentData);
      toast.success(res.data.message);
      return true;
    } catch (error) {
      console.log("Error verifying payment", error);
      toast.error("Payment verification failed");
      return false;
    } finally {
      set({ isVerifyingPayment: false });
    }
  }
}));