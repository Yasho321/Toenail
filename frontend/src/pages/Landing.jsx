import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Youtube, Zap, Star, CheckCircle } from 'lucide-react';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { authUser, isLoggingIn, isSigningUp, login, signup } = useAuthStore();

  if (authUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isLogin 
      ? await login({ email: formData.email, password: formData.password })
      : await signup(formData);
    
    if (success) {
      // Navigation will happen automatically due to authUser state change
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background px-15 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-card/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Youtube className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-white">
                  ToeNail AI
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsLogin(!isLogin)}
                className="hidden sm:inline-flex border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-88px)]">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    <span className="text-red-600">YouTube</span>
                    <br />
                    <span className="bg-gradient-primary bg-clip-text text-white">
                     Thumbnails Made Easy
                    </span>
                  </h1>
                </div>
              
                <div className="mb-8">
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                    <span className="text-3xl font-bold text-muted-foreground line-through">₹1000/thumbnail</span>
                    <span className="text-5xl font-bold bg-gradient-primary bg-clip-text text-red-600">
                      ₹22/thumbnail
                    </span>
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Professional YouTube thumbnails powered by AI
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'AI-powered thumbnail generation',
                    'Professional quality designs',
                    'Multiple variations per request',
                    'Instant download'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-center lg:justify-start space-x-3">
                      <div className="p-1 bg-gradient-primary rounded-full">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="ml-3 text-sm font-semibold bg-gradient-primary bg-clip-text text-red-600">
                    HC Backed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <Card className="w-full max-w-md relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-lg"></div>
              <CardHeader className="text-center relative z-10">
                <CardTitle className="text-3xl font-bold mb-2">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </CardTitle>
                <CardDescription className="text-base">
                  {isLogin 
                    ? 'Sign in to your account to continue' 
                    : 'Create your account and get 3 free tokens'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="h-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-12 pr-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full h-12 text-base font-semibold"
                    disabled={isLoggingIn || isSigningUp}
                  >
                    {isLoggingIn || isSigningUp ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {isLogin 
                        ? "Don't have an account? Sign up" 
                        : "Already have an account? Sign in"
                      }
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;