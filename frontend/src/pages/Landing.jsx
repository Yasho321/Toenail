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
    <div className="min-h-screen bg-background py-5 px-10">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-foreground">ToeNail AI</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsLogin(!isLogin)}
              className="hidden sm:inline-flex text-white hover:text-red-600"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600 mb-6">
                  YouTube Thumbnails
                  <span className="block bg-gradient-primary bg-clip-text text-white">Made Easy</span>
                </h1>
              
              <div className="mb-8">
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                  <span className="text-3xl font-bold text-muted-foreground line-through">₹1000</span>
                  <span className="text-5xl font-bold bg-gradient-primary bg-clip-text text-red-600">₹22</span>
                </div>
                <p className="text-xl text-muted-foreground">
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
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="ml-2">HC Backed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <Card className="w-full max-w-md shadow-card border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Create your account and get 3 free tokens'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="h-11"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full hover:text-red-600"
                  disabled={isLoggingIn || isSigningUp}
                >
                  {isLoggingIn || isSigningUp ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
  );
};

export default Landing;