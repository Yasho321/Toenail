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
          name: 'ThumbnailAI',
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
      
      {/* Floating Orbs Animation */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-red-700/10 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-red-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
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
        {/* Enhanced Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link to="/" className="flex items-center space-x-3 group transition-all duration-200 hover:translate-x-1">
                <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-600/30">
                  <img src="./logo.png" className="w-6 h-6"/>
                </div>
                <span className="text-xl font-bold">Toenail <span className="text-red-600">AI</span></span>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Header */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/10 to-red-700/10 border border-red-600/20 rounded-full px-6 py-3 mb-10 backdrop-blur-sm">
              <Coins className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-red-400 tracking-wide">TOKEN-BASED PRICING</span>
              <Sparkles className="w-4 h-4 text-red-400" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tight leading-none">
              Choose Your
              <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                Token Package
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Pay only for what you use. No monthly subscriptions, no hidden fees.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span>Tokens never expire</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>No commitments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Pricing Cards */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Standard Plan */}
              <Card className="group relative p-8 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl text-white border border-white/10 hover:border-red-600/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/10">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="relative text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/30">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">Standard</h3>
                  <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">₹800</div>
                  
                  <div className="bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2 mb-6 inline-block">
                    <span className="text-red-400 font-semibold">{plans?.standard?.tokens || 10} AI Thumbnails</span>
                  </div>
                  
                  <p className="text-white/60 mb-8 bg-black/20 rounded-lg px-3 py-2 border border-white/5">
                    ₹{Math.round((plans?.standard?.amount || 800) / (plans?.standard?.tokens || 10))} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-10 text-left">
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">{plans?.standard?.tokens || 10} AI-generated thumbnails</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">High-quality 1280x720 resolution</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">Basic support</span>
                    </li>
                  </ul>

                  {user ? (
                    <Button
                      onClick={() => handlePurchase('standard')}
                      disabled={isProcessingPayment || selectedPlan === 'standard'}
                      className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 font-semibold"
                    >
                      {selectedPlan === 'standard' ? 'Processing...' : 'Choose Standard'}
                    </Button>
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 font-semibold">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </Card>

              {/* Premium Plan */}
              <Card className="group relative p-8 bg-gradient-to-br from-red-950/60 to-red-900/40 backdrop-blur-xl text-white border-2 border-red-600/50 hover:border-red-500 transition-all duration-500 scale-110 shadow-2xl shadow-red-600/20">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                    🔥 MOST POPULAR
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-700/5 rounded-lg"></div>
                
                <div className="relative text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300  shadow-red-500/40">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">Premium</h3>
                  <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">₹1,400</div>
                  
                  <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6 inline-block">
                    <span className="text-red-300 font-semibold">{plans?.premium?.tokens || 25} AI Thumbnails</span>
                  </div>
                  
                  <p className="text-white/70 mb-8 bg-red-950/30 rounded-lg px-3 py-2 border border-red-600/20">
                    ₹{Math.round((plans?.premium?.amount || 1400) / (plans?.premium?.tokens || 25))} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-10 text-left">
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white">{plans?.premium?.tokens || 25} AI-generated thumbnails</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white">Ultra HD 1920x1080 resolution</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white">Multiple format downloads</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white">Priority support</span>
                    </li>
                  </ul>

                  {user ? (
                    <Button
                      onClick={() => handlePurchase('premium')}
                      disabled={isProcessingPayment || selectedPlan === 'premium'}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 transition-all duration-300 py-3 font-semibold shadow-lg hover:shadow-xl"
                    >
                      {selectedPlan === 'premium' ? 'Processing...' : 'Choose Premium'}
                    </Button>
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 transition-all duration-300 py-3 font-semibold shadow-lg hover:shadow-xl">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className="group relative p-8 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl text-white border border-white/10 hover:border-red-600/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/10">
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    BEST VALUE
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="relative text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/30">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">Pro</h3>
                  <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">₹2,450</div>
                  
                  <div className="bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2 mb-6 inline-block">
                    <span className="text-red-400 font-semibold">{plans?.pro?.tokens || 50} AI Thumbnails</span>
                  </div>
                  
                  <p className="text-white/60 mb-8 bg-black/20 rounded-lg px-3 py-2 border border-white/5">
                    ₹{Math.round((plans?.pro?.amount || 2450) / (plans?.pro?.tokens || 50))} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-10 text-left">
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">{plans?.pro?.tokens || 50} AI-generated thumbnails</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">Ultra HD quality</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">Fastest processing</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span className="text-white/90">24/7 priority support</span>
                    </li>
                  </ul>

                  {user ? (
                    <Button
                      onClick={() => handlePurchase('pro')}
                      disabled={isProcessingPayment || selectedPlan === 'pro'}
                      className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 font-semibold"
                    >
                      {selectedPlan === 'pro' ? 'Processing...' : 'Choose Pro'}
                    </Button>
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 font-semibold">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </Card>
            </div>

            {/* Enhanced Features Section */}
            <div className="mt-32">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  All plans include
                </h2>
                <p className="text-white/60 text-lg">Everything you need to create stunning thumbnails</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Zap className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-3 text-lg">Personalized AI</h3>
                  <p className="text-sm text-white/60 leading-relaxed">It remembers your preferences and learns your style</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Sparkles className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-3 text-lg">AI-Powered</h3>
                  <p className="text-sm text-white/60 leading-relaxed">Advanced AI technology for perfect thumbnails</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Shield className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-3 text-lg">No Watermarks</h3>
                  <p className="text-sm text-white/60 leading-relaxed">Clean, professional output without branding</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-600/20">
                    <Clock className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold mb-3 text-lg">No Expiry</h3>
                  <p className="text-sm text-white/60 leading-relaxed">Tokens never expire, use them anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}