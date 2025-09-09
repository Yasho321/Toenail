import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check, Play, Star, Users, Zap, ArrowRight, ImageIcon, Download } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ThumbnailAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignInButton>
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="hero">Get Started</Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              YouTube Thumbnails
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                That Convert Like Crazy
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Create professional YouTube thumbnails in seconds with AI. No design skills needed. 
              Just upload your image and let our AI do the magic.
            </p>
            
            {/* Pricing Hero */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className="text-3xl font-bold text-muted-foreground line-through">₹1,000</span>
              <span className="text-5xl font-bold text-primary">₹22</span>
              <span className="text-lg text-muted-foreground">per thumbnail</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <SignUpButton>
                <Button variant="hero" size="xl" className="group">
                  Start Creating Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignUpButton>
              <Button variant="premium" size="xl" className="group">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>1000+ creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>30 sec generation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Why Choose ThumbnailAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional quality thumbnails that help your videos get more clicks and views
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate professional thumbnails in under 30 seconds. No waiting, no delays.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <ImageIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Design</h3>
              <p className="text-muted-foreground">
                Advanced AI understands your content and creates thumbnails that convert.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Download className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">High Quality Export</h3>
              <p className="text-muted-foreground">
                Download in multiple formats and resolutions. Perfect for YouTube.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Pay only for what you use. No monthly subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Standard */}
            <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Standard</h3>
                <div className="text-3xl font-bold mb-6">₹250</div>
                <p className="text-muted-foreground mb-6">10 Thumbnails</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>10 AI thumbnails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>High quality export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Basic support</span>
                  </li>
                </ul>
                <SignUpButton>
                  <Button variant="outline" className="w-full">Choose Plan</Button>
                </SignUpButton>
              </div>
            </Card>

            {/* Premium */}
            <Card className="p-8 bg-card border-primary/50 hover:border-primary transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Premium</h3>
                <div className="text-3xl font-bold mb-6">₹600</div>
                <p className="text-muted-foreground mb-6">25 Thumbnails</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>25 AI thumbnails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Premium quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Multiple formats</span>
                  </li>
                </ul>
                <SignUpButton>
                  <Button variant="hero" className="w-full">Choose Plan</Button>
                </SignUpButton>
              </div>
            </Card>

            {/* Pro */}
            <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-6">₹1,100</div>
                <p className="text-muted-foreground mb-6">50 Thumbnails</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>50 AI thumbnails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Ultra HD quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>24/7 support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Commercial license</span>
                  </li>
                </ul>
                <SignUpButton>
                  <Button variant="outline" className="w-full">Choose Plan</Button>
                </SignUpButton>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-primary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Create Viral Thumbnails?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who trust ThumbnailAI for their YouTube success
          </p>
          <SignUpButton>
            <Button variant="hero" size="xl" className="group">
              Start Creating for Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 ThumbnailAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}