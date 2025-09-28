import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { usePaymentStore } from '../stores/paymentStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { ArrowLeft, Download, Receipt, CreditCard, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Transactions() {
  const { getToken } = useAuth();
  const { payments, isLoadingPayments, fetchPayments, downloadReceipt } = usePaymentStore();
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchPayments(getToken);
  }, []);

  const handleDownloadReceipt = async (paymentId) => {
    setDownloadingId(paymentId);
    const success = await downloadReceipt(paymentId, getToken);
    setDownloadingId(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-chat-text-muted';
    }
  };

  if (isLoadingPayments) {
    return (
      <div className="min-h-screen bg-[#1E1A1F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1A1F] text-white">
      {/* Header */}
      <div className="border-b border-chat-border bg-chat-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-chat-text hover:text-white hover:bg-[#151015]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-chat-text">Transaction History</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
            <p className="text-white-muted mb-6">Your payment history will appear here once you make a purchase.</p>
            <Link to="/pricing">
              <Button variant="default" className="bg-[#1E1A1F] hover:bg-[#1E1A1F]/90">
                <CreditCard className="w-4 h-4 mr-2" />
                Purchase Tokens
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment._id} className="bg-[#0B0B0F] border-none shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1E1A1F]/10 rounded-lg flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-white gap-3">
                        <h3 className="font-medium text-white">
                          Payment #{payment.receiptNumber || payment._id.slice(-8)}
                        </h3>
                        <span className={`text-sm font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-white-muted">
                        <div className="flex items-center text-white gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </div>
                        
                        <div className="flex text-white items-center gap-1">
                          
                          ₹{payment.amount}
                        </div>
                        
                        <div className="flex text-white items-center gap-1">
                          <span className="w-4 h-4 flex items-center justify-center bg-yellow-500/20 rounded text-yellow-500 text-xs font-bold">
                            T
                          </span>
                          {payment.tokens} tokens
                        </div>
                      </div>
                      
                      {payment.razorpayId && (
                        <p className="text-xs text-white">
                          Payment ID: {payment.razorpayId}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReceipt(payment._id)}
                    disabled={downloadingId === payment._id}
                    className="border-chat-border bg-[#1E1A1F] text-white hover:bg-[#151015] hover:text-white"
                  >
                    {downloadingId === payment._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Download Receipt</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}