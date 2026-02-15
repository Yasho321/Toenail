import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { usePaymentStore } from '../stores/paymentStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Check, 
  ArrowLeft, 
  Zap, 
  Crown, 
  Star, 
  Sparkles, 
  Shield, 
  Clock, 
  Download, 
  MessageSquare,
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Pricing() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { plans, createOrder, verifyPayment, isProcessingPayment } = usePaymentStore();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePurchase = async (planName) => {
    if (!user) {
      toast.error('Please sign in to purchase tokens');
      return;
    }

    setSelectedPlan(planName);
    
    try {
      const orderData = await createOrder(planName, getToken);
      if (!orderData) return;

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount * 100,
          currency: 'INR',
          name: 'ToenailAI',
          description: `${plans[planName].name} Plan - ${plans[planName].tokens} Tokens`,
          order_id: orderData.orderId,
          handler: async (response) => {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const isVerified = await verifyPayment(paymentData, getToken);
            if (isVerified) {
              toast.success(`Payment successful! ${plans[planName].tokens} tokens added.`);
              window.location.href = '/dashboard';
            }
          },
          prefill: {
            name: user.fullName || user.firstName || '',
            email: user.emailAddresses[0]?.emailAddress || '',
          },
          theme: { color: '#DC2626' },
          modal: { ondismiss: () => setSelectedPlan(null) },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-red-500/30">
      
      {/* --- Background Effects (Matching Landing) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.08) 0%, rgba(0, 0, 0, 0) 30%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
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
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Header */}
        <header className="py-20 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Credits Never Expire
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
              Simple, <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Transparent</span> Pricing
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Why pay for subscriptions? Buy tokens when you need them. 
              Each token generates one high-CTR thumbnail instantly.
            </p>
          </div>
        </header>

        {/* Pricing Grid */}
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              
              {/* Standard */}
              <div className="p-8 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-gray-400 group-hover:text-red-500 transition-colors">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">₹{plans?.standard?.amount || 800}</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  {plans?.standard?.tokens || 10} Thumbnails (₹{Math.round((plans?.standard?.amount || 800) / (plans?.standard?.tokens || 10))}/each)
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[`${plans?.standard?.tokens || 10} AI generations`, "720p HD Resolution", "Standard Support", "Standard Speed"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
                
                {user ? (
                  <Button 
                    onClick={() => handlePurchase('standard')}
                    disabled={isProcessingPayment || selectedPlan === 'standard'}
                    className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                  >
                    {selectedPlan === 'standard' ? 'Processing...' : 'Choose Standard'}
                  </Button>
                ) : (
                  <Link to="/signin" className="block w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-center font-medium transition-colors">
                    Sign In to Purchase
                  </Link>
                )}
              </div>

              {/* Premium (Highlighted) */}
              <div className="relative p-8 rounded-2xl bg-[#111] border border-red-500/50 shadow-[0_0_30px_-10px_rgba(220,38,38,0.3)] transform md:-translate-y-4 z-10">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-red-900/20">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">₹{plans?.premium?.amount || 1400}</span>
                </div>
                <p className="text-sm text-red-200/70 mb-6">
                  {plans?.premium?.tokens || 25} Thumbnails (₹{Math.round((plans?.premium?.amount || 1400) / (plans?.premium?.tokens || 25))}/each)
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[`${plans?.premium?.tokens || 25} AI generations`, "1080p Ultra HD", "Priority Support", "Fast Processing", "Commercial License"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                         <Check className="w-3 h-3 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                
                {user ? (
                  <Button 
                    onClick={() => handlePurchase('premium')}
                    disabled={isProcessingPayment || selectedPlan === 'premium'}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold transition-all shadow-lg shadow-red-900/40"
                  >
                    {selectedPlan === 'premium' ? 'Processing...' : 'Choose Premium'}
                  </Button>
                ) : (
                  <Link to="/signin" className="block w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white text-center font-bold transition-all shadow-lg shadow-red-900/40">
                    Sign In to Purchase
                  </Link>
                )}
              </div>

              {/* Pro */}
              <div className="p-8 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-gray-400 group-hover:text-red-500 transition-colors">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">₹{plans?.pro?.amount || 2450}</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  {plans?.pro?.tokens || 50} Thumbnails (₹{Math.round((plans?.pro?.amount || 2450) / (plans?.pro?.tokens || 50))}/each)
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[`${plans?.pro?.tokens || 50} AI generations`, "4K Ultra Resolution", "24/7 VIP Support", "Instant Processing", "API Early Access"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
                
                {user ? (
                  <Button 
                    onClick={() => handlePurchase('pro')}
                    disabled={isProcessingPayment || selectedPlan === 'pro'}
                    className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                  >
                    {selectedPlan === 'pro' ? 'Processing...' : 'Choose Pro'}
                  </Button>
                ) : (
                  <Link to="/signin" className="block w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-center font-medium transition-colors">
                    Sign In to Purchase
                  </Link>
                )}
              </div>
            </div>

            {/* Included Features Section */}
            <div className="mt-20 pt-10 border-t border-white/5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { icon: Shield, l: "No Watermarks" },
                  { icon: Clock, l: "Lifetime Access" },
                  { icon: Sparkles, l: "AI Optimization" },
                  { icon: Download, l: "All Formats" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-gray-400">
                    <item.icon className="w-5 h-5 text-red-500/50" />
                    <span className="text-sm font-medium">{item.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Highlights */}
        <section className="py-24 border-t border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Invest in <span className="text-red-500">Toenail AI</span>?</h2>
              <p className="text-gray-400">Professional quality at 1/10th the cost of a freelancer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Personalized AI", text: "Learns your brand colors and face to keep thumbnails consistent with your channel." },
                { icon: MessageSquare, title: "Chat to Edit", text: "Not happy with the result? Just chat with the AI to change text, colors, or elements." },
                { icon: Crown, title: "CTR Optimized", text: "Trained on millions of high-performing videos to ensure your content gets the clicks it deserves." }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-red-500/30 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 bg-[#020202]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                    <img src="./logo.png" className="w-4 h-4" alt="Logo" />
                  </div>
                  <span className="font-bold">Toenail AI</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The #1 AI Thumbnail generator for YouTube creators. Boost CTR and save time instantly.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li><a href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms-conditions" className="hover:text-red-500 transition-colors">Terms & Conditions</a></li>
                  <li><a href="/cancellation-refunds" className="hover:text-red-500 transition-colors">Refund Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4 text-sm">Links</h4>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li><Link to="/pricing" className="hover:text-red-500 transition-colors">Pricing</Link></li>
                  <li><Link to="/features" className="hover:text-red-500 transition-colors">Features</Link></li>
                  <li><Link to="/dashboard" className="hover:text-red-500 transition-colors">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4 text-sm">Contact</h4>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li><a href="mailto:support@toenailai.com" className="hover:text-white transition-colors">support@toenailai.com</a></li>
                  <li className="flex items-center gap-2 mt-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Systems Online</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600">
              <p>&copy; 2026 Toenail AI. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <span>Made for Creators ❤️</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}