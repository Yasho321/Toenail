import { useState } from 'react';
import { useUser, SignInButton, useAuth } from '@clerk/clerk-react';
import { usePaymentStore } from '../stores/paymentStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Check, ArrowLeft, Coins, Zap, Crown, Star , Sparkles ,Shield , Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Pricing() {
  const { user } = useUser();
  const {getToken}= useAuth();
  const { plans, createOrder, verifyPayment, isProcessingPayment } = usePaymentStore();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePurchase = async (planName) => {
    if (!user) {
      toast.error('Please sign in to purchase tokens');
      return;
    }

    setSelectedPlan(planName);
    
    try {
      const orderData = await createOrder(planName ,getToken);
      if (!orderData) return;

      // Load Razorpay script
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

            const isVerified = await verifyPayment(paymentData,getToken);
            if (isVerified) {
              toast.success(`Payment successful! ${plans[planName].tokens} tokens added to your account.`);
              // Redirect to dashboard
              window.location.href = '/dashboard';
            }
          },
          prefill: {
            name: user.fullName || user.firstName || '',
            email: user.emailAddresses[0]?.emailAddress || '',
          },
          theme: {
            color: '#DC2626',
          },
          modal: {
            ondismiss: () => {
              setSelectedPlan(null);
            },
          },
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
         <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Enhanced Background with Animated Elements */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
             "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
        }}
      />
      
      {/* Floating Orbs Animation - Hidden on mobile to prevent overflow */}
      <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden sm:block absolute top-40 right-20 w-24 h-24 bg-red-700/10 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="hidden sm:block absolute bottom-40 left-1/4 w-40 h-40 bg-red-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Enhanced Vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)",
          opacity: 0.9,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Enhanced Navigation - Mobile Responsive */}
        <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 sm:py-6">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-200 hover:translate-x-1">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base">Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-600/30">
                  <img src="./logo.png" className="w-4 h-4 sm:w-6 sm:h-6"/>
                </div>
                <span className="text-lg sm:text-xl font-bold">Toenail <span className="text-red-600">AI</span></span>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Header - Mobile Responsive */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-5xl mx-auto text-center px-3 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/10 to-red-700/10 border border-red-600/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-10 backdrop-blur-sm">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-xs sm:text-sm font-semibold text-red-400 tracking-wide">TOKEN-BASED PRICING</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 tracking-tight leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                Token Package
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              Pay only for what you use. No monthly subscriptions, no hidden fees.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/50">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span>Tokens never expire</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>No commitments</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-red-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Pricing Cards - Mobile Responsive */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Standard Plan */}
              <Card className="p-8 bg-black/40 backdrop-blur-sm text-white border-white/10 hover:border-red-600/20 transition-all duration-300 relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Standard</h3>
                  <div className="text-4xl font-bold mb-2">₹800</div>
                  <p className="text-white/70 mb-6">
                    {plans?.standard?.tokens || 10} AI Thumbnails
                  </p>
                 <p className="text-white/60 mb-4 sm:mb-6 lg:mb-8 bg-black/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/5 text-sm">
                    ₹{Math.round((plans?.standard?.amount || 800) / (plans?.standard?.tokens || 10))} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>{plans?.standard?.tokens || 10} AI-generated thumbnails</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>High-quality 1280x720 resolution</span>
                    </li>
                    
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>Basic support</span>
                    </li>
                  </ul>

                  {user ? (
                    <Button
                      onClick={() => handlePurchase('standard')}
                      disabled={isProcessingPayment || selectedPlan === 'standard'}
                      className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    >
                      {selectedPlan === 'standard' ? 'Processing...' : 'Choose Standard'}
                    </Button>
                  ) : (
                     <div className="w-full bg-white/10 text-white rounded-md hover:bg-white/20">
                    <Link to="/signin" className="px-5 py-1.5 rounded-lg flex items-center justify-center" >
                        Sign In to Purchase
                      </Link></div>
                  )}
                </div>
              </Card>

              {/* Premium Plan */}
              <Card className="p-8 bg-black/40 backdrop-blur-sm text-white border-red-600/50 hover:border-red-600 transition-all duration-300 relative scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-4xl font-bold mb-2">₹1,400</div>
                  <p className="text-white/70 mb-6">
                    {plans?.premium?.tokens || 25} AI Thumbnails
                  </p>
                  <p className="text-white/60 mb-4 sm:mb-6 lg:mb-8 bg-black/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/5 text-sm">
                    ₹{Math.round((plans?.premium?.amount || 1400) / (plans?.premium?.tokens || 25))} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{plans?.premium?.tokens || 25} AI-generated thumbnails</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Ultra HD 1920x1080 resolution</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Multiple format downloads</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Priority support</span>
                    </li>
                  </ul>

                  {user ? (
                    <Button
                      onClick={() => handlePurchase('premium')}
                      disabled={isProcessingPayment || selectedPlan === 'premium'}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                    >
                      {selectedPlan === 'premium' ? 'Processing...' : 'Choose Premium'}
                    </Button>
                  ) : (
                   
                     <div className="w-full rounded-md bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800">
                    <Link to="/signin" className="px-5 py-1.5 rounded-lg flex items-center justify-center" >
                        Sign In to Purchase
                      </Link></div>
                  )}
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className="p-8 bg-black/40 backdrop-blur-sm text-white border-white/10 hover:border-red-600/20 transition-all duration-300 relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-2">₹2,450</div>
                  <p className="text-white/70 mb-6">
                    {plans?.pro?.tokens || 50} AI Thumbnails
                  </p>
                  <p className="text-white/60 mb-4 sm:mb-6 lg:mb-8 bg-black/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/5 text-sm">
                    ₹{Math.round((plans?.pro?.amount || 2450) / (plans?.pro?.tokens || 50))} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>{plans?.pro?.tokens || 50} AI-generated thumbnails</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>Ultra HD quality</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>Fastest processing</span>
                    </li>
                    
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>24/7 priority support</span>
                    </li>
                  </ul>

                  {user ? (
                    <Button
                      onClick={() => handlePurchase('pro')}
                      disabled={isProcessingPayment || selectedPlan === 'pro'}
                      className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    >
                      {selectedPlan === 'pro' ? 'Processing...' : 'Choose Pro'}
                    </Button>
                  ) : (
                     <div className="w-full bg-white/10 text-white rounded-md hover:bg-white/20">
                    <Link to="/signin" className="px-5 py-1.5 rounded-lg flex items-center justify-center" >
                        Sign In to Purchase
                      </Link></div>
                  )}
                </div>
              </Card>
            </div>

            {/* Enhanced Features Section - Mobile Responsive */}
            <div className="mt-16 sm:mt-24 lg:mt-32">
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  All plans include
                </h2>
                <p className="text-white/60 text-base sm:text-lg px-4">Everything you need to create stunning thumbnails</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg">Personalized AI</h3>
                  <p className="text-sm text-white/60 leading-relaxed">It remembers your preferences and learns your style</p>
                </div>
                
                <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg">AI-Powered</h3>
                  <p className="text-sm text-white/60 leading-relaxed">Advanced AI technology for perfect thumbnails</p>
                </div>
                
                <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg">No Watermarks</h3>
                  <p className="text-sm text-white/60 leading-relaxed">Clean, professional output without branding</p>
                </div>
                
                <div className="group text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg">No Expiry</h3>
                  <p className="text-sm text-white/60 leading-relaxed">Tokens never expire, use them anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="border-t border-gray-800 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <img src="./logo.png" alt="Toenail AI Logo" />
                  </div>
                  <span className="text-lg font-bold text-white">Toenail <span className="text-red-600">AI</span></span>
                </div>
                <p className="text-gray-400 text-sm">
                  Create viral YouTube thumbnails with AI in just 2 minutes. Professional results at fraction of the cost.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms-conditions" className="text-gray-400 hover:text-red-400 transition-colors">Terms & Conditions</a></li>
                  <li><a href="/cancellation-refunds" className="text-gray-400 hover:text-red-400 transition-colors">Cancellation & Refunds</a></li>
                  <li><a href="/shipping" className="text-gray-400 hover:text-red-400 transition-colors">Delivery Information</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="text-gray-400 hover:text-red-400 transition-colors">Contact Us</a></li>
                  <li><a href="mailto:support@toenailai.com" className="text-gray-400 hover:text-red-400 transition-colors">support@toenailai.com</a></li>
                  <li><span className="text-gray-400">Response within 2 hours</span></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
              <p className="text-sm sm:text-base">&copy; 2025 Toenail AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}