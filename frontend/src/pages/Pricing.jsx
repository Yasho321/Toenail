import { useState } from 'react';
import { useUser, SignInButton, useAuth } from '@clerk/clerk-react';
import { usePaymentStore } from '../stores/paymentStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Check, ArrowLeft, Coins, Zap, Crown, Star } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-black relative">
      {/* Crimson Core Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
             "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
        }}
      />
      {/* Soft vignette to blend edges */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          opacity: 0.95,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Navigation */}
        <nav className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                  <img src="./logo.png"/>
                </div>
                <span className="text-xl font-bold">Toenail <span className="text-red-600">AI</span></span>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                {' '}Token Package
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Pay only for what you use. No monthly subscriptions, no hidden fees.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
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
                  <p className="text-sm text-white/70 mb-8">
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
                    <SignInButton>
                      <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
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
                  <p className="text-sm text-white/70 mb-8">
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
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
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
                  <p className="text-sm text-white/70 mb-8">
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
                    <SignInButton>
                      <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </Card>
            </div>

            {/* Features Section */}
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-bold mb-8">All plans include</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalized AI</h3>
                  <p className="text-sm text-white/70">It remembers your preferences</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered</h3>
                  <p className="text-sm text-white/70">Advanced AI technology</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">No Watermarks</h3>
                  <p className="text-sm text-white/70">Clean, professional output</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Coins className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">No Expiry</h3>
                  <p className="text-sm text-white/70">Tokens never expire</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}