import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { usePaymentStore } from '../stores/paymentStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  ArrowLeft, 
  Download, 
  Receipt, 
  CreditCard, 
  Calendar, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Transactions() {
  const { getToken } = useAuth();
  const { payments, isLoadingPayments, fetchPayments, downloadReceipt } = usePaymentStore();
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchPayments(getToken);
  }, []);

  const handleDownloadReceipt = async (paymentId) => {
    setDownloadingId(paymentId);
    await downloadReceipt(paymentId, getToken);
    setDownloadingId(null);
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  if (isLoadingPayments) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-red-500/30">
      
      {/* --- Background Effects (Matching Landing) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.1) 0%, rgba(0, 0, 0, 0) 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    <img src="./logo.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">Toenail <span className="text-red-500">AI</span></span>
                </Link>
              </div>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-800 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Transaction <span className="text-red-500">History</span></h1>
            <p className="text-gray-400">View and download your invoices for all token purchases.</p>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No transactions yet</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your payment history will appear here once you purchase credits.</p>
              <Link to="/pricing">
                <Button className="bg-red-600 hover:bg-red-500 text-white px-8 py-6 rounded-lg font-bold transition-all hover:scale-105">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Tokens Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card 
                  key={payment._id} 
                  className="bg-[#0A0A0A] border border-white/5 hover:border-red-500/20 transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      {/* Icon with Landing Page Style */}
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                        <Zap className="w-6 h-6 text-red-500" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-white font-mono">
                            #{payment.receiptNumber || payment._id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${getStatusStyles(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-green-400 font-bold">₹{payment.amount}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-white font-medium">{payment.tokens} Tokens</span>
                          </div>
                        </div>
                        
                        {payment.razorpayId && (
                          <p className="text-[10px] text-gray-600 font-mono mt-2">
                            REF: {payment.razorpayId}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment._id)}
                        disabled={downloadingId === payment._id}
                        className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all h-10 px-4"
                      >
                        {downloadingId === payment._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        Receipt
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Trust Badge Footer */}
          <div className="mt-12 flex items-center justify-center gap-8 py-8 border-t border-white/5">
             <div className="flex items-center gap-2 text-gray-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-red-500/50" />
                <span>Secure Payments</span>
             </div>
             <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Receipt className="w-4 h-4 text-red-500/50" />
                <span>GST Compliant Invoices</span>
             </div>
          </div>
        </main>
      </div>

      {/* Footer (Simplified from Landing) */}
      <footer className="border-t border-white/5 py-8 bg-[#020202] relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-600">
          <p>&copy; 2026 Toenail AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}