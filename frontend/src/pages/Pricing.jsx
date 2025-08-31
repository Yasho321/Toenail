import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useState } from "react";
import { axiosInstance } from '@/lib/axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Youtube, 
  ArrowLeft, 
  Check, 
  Zap, 
  Star, 
  Crown,
  Rocket,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { authUser, addTokens } = useAuthStore();
    const [paymentLoad, setPaymentLoad] = useState(false)
  const [planSelected , setPlanSelected] = useState(null);

  const navigate = useNavigate();

  const plans = [
    {
      name: 'standard',
      title: 'Standard',
      price: '₹250',
      tokens: 10,
      icon: Zap,
      description: 'Perfect for small creators',
      features: [
        '10 AI-generated thumbnails',
        'HD quality (1280x720)',
        'Multiple design variations',
        'Instant download'
      ],
      popular: false
    },
    {
      name: 'premium',
      title: 'Premium',
      price: '₹600',
      tokens: 25,
      icon: Star,
      description: 'Best value for regular creators',
      features: [
        '25 AI-generated thumbnails',
        'Full HD quality (1920x1080)',
        'Multiple design variations',
        'Priority processing',
        'Bulk download'
      ],
      popular: true
    },
    {
      name: 'pro',
      title: 'Pro',
      price: '₹1100',
      tokens: 50,
      icon: Crown,
      description: 'For professional content creators',
      features: [
        '50 AI-generated thumbnails',
        'Ultra HD quality',
        'Unlimited variations',
        'Priority support',
        'Custom branding options',
        'API access'
      ],
      popular: false
    }
  ];

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handlePurchase = async (plan) => {
   try {

      setPaymentLoad(true);

      setPlanSelected(plan);
         const isScriptLoaded = await loadRazorpayScript();
      
      const { data } = await axiosInstance.post("/payment/create-order", { planName : plan });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from env
        amount: data.amount * 100,
        currency: "INR",
        name: "Token Purchase",
        description: `${plan} pack`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
             
            
              await axiosInstance.post("/payment/verify-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                tokens: data.tokens,
                amount: data.amount,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              setPaymentLoad(false)
              addTokens(data.tokens);
              navigate("/");
              toast.success("Tokens added successfully!");
            
          } catch (error) {
            console.error(error)
            toast.error("Error in verifying payment");
            
            
          }finally{
            setPaymentLoad(false)
            setPlanSelected(null)
            
          }
        }
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

      setPaymentLoad(false)
      setPlanSelected(null)
      
    } catch (error) {
      console.log(error);
      setPaymentLoad(false)
      setPlanSelected(null)
    }finally{
       navigate("/");
    }
  };

   const getButtonText = (planName) => {
    if (paymentLoad && planSelected === planName) {
      return "Processing..."
    }
    return "Get Started Now"
  }

  const isButtonLoading = (planName) => {
    return paymentLoad && planSelected === planName
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-foreground">ToeNail AI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-red-600 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of AI-generated thumbnails and take your YouTube channel to the next level
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.name}
                className={`relative shadow-card border-border/40 ${
                  plan.popular ? 'border-primary/50 shadow-primary/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-primary text-red-600 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-primary/20' : 'bg-secondary'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        plan.popular ? 'text-primary' : 'text-foreground'
                      }`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.tokens} tokens included
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handlePurchase(plan.name)}
                    disabled={isButtonLoading(plan.name)}
                    variant={plan.popular ? "hero" : "premium"}
                    size="lg"
                    className="w-full hover:text-red-600"
                  >
                    {getButtonText(plan.name)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include instant download, commercial usage rights, and 24/7 support
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span>No Subscription</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;