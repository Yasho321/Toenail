import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set) => ({
  isProcessingPayment: false,
  payments: [],
  isLoadingPayments: false,
  
  plans: {
    standard: { amount: 800, tokens: 10, name: 'Standard' },
    premium: { amount: 1400, tokens: 25, name: 'Premium' },
    pro: { amount: 2450, tokens: 50, name: 'Pro' },
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
      const token =await getToken();
      
      
      const response = await axiosInstance.post('/payment/verify', paymentData,{
         headers: {
          Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
           // Attach token
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
  },
  fetchPayments: async (getToken) => {
    try {
      set({ isLoadingPayments: true });
      const token = await getToken();
      const response = await axiosInstance.get('/payment/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ payments: response.data.payments || [] });
      return response.data.payments;
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment history");
      return [];
    } finally {
      set({ isLoadingPayments: false });
    }
  },

  downloadReceipt: async (paymentId, getToken) => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get(`/payment/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Receipt downloaded successfully!");
      return true;
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
      return false;
    }
  }
}));