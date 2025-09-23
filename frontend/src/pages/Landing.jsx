import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check, Play, Star, Users, Zap, ArrowRight, ImageIcon, Download } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Crimson Core Glow */}
      <div
        className="absolute inset-0 z-1"
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
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center">
                  <img src="../../public/logo.png"/>
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">Toenail <span className="text-red-600">AI</span></span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <SignInButton>
                  <Button variant="ghost" className="text-white hover:bg-red-600 hover:text-white text-sm sm:text-base px-2 sm:px-4">Sign In</Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base px-2 sm:px-4">Get Started</Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-32 overflow-hidden">
          <div className="absolute inset-0"></div>
          <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 text-white ">
                YouTube Thumbnails
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  That Demand Attention
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
                Create professional YouTube thumbnails in seconds with AI. No design skills needed. 
                Just upload your image and let our AI do the magic.
              </p>
              
              {/* Pricing Hero */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-400 line-through">₹1,000</span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-500">₹49</span>
                <span className="text-sm sm:text-base lg:text-lg text-gray-300">per thumbnail</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
                <SignUpButton>
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg group w-full sm:w-auto" size="lg">
                    Start Creating Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 ml-2" />
                  </Button>
                </SignUpButton>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 sm:px-8 py-3 text-base sm:text-lg group w-full sm:w-auto" size="lg">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-500" />
                  <span>1000+ creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-500" />
                  <span>HC Backed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white px-2">
                Why Choose Toenail <span className="text-red-600">AI</span>?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                Professional quality thumbnails that help your videos get more clicks and views
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Personalized AI</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  It remembers your preferences, what you like and what you don't like.
                </p>
              </Card>

              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">AI-Powered Design</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Advanced AI understands your content and creates thumbnails that convert.
                </p>
              </Card>

              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">High Quality Export</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Download in multiple formats and resolutions. Perfect for YouTube.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white px-2">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 px-2">
                Pay only for what you use. No monthly subscriptions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
              {/* Standard */}
              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Standard</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">₹800</div>
                  <p className="text-gray-400 mb-4 sm:mb-6">10 Thumbnails</p>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">10 AI thumbnails</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">High quality export</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">Basic support</span>
                    </li>
                  </ul>
                  <SignUpButton>
                    <Button variant="outline" className="w-full bg-red-700 hover:bg-red-600 hover:text-white text-white border-none text-sm sm:text-base">Choose Plan</Button>
                  </SignUpButton>
                </div>
              </Card>

              {/* Premium */}
              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300 relative sm:col-span-2 lg:col-span-1">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Popular
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Premium</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">₹1,400</div>
                  <p className="text-gray-400 mb-4 sm:mb-6">25 Thumbnails</p>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">25 AI thumbnails</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">Premium quality</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">Multiple formats</span>
                    </li>
                  </ul>
                  <SignUpButton>
                    <Button className="w-full bg-red-700 hover:bg-red-600 hover:text-white text-white text-sm sm:text-base">Choose Plan</Button>
                  </SignUpButton>
                </div>
              </Card>

              {/* Pro */}
              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Pro</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">₹2,450</div>
                  <p className="text-gray-400 mb-4 sm:mb-6">50 Thumbnails</p>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">50 AI thumbnails</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">Ultra HD quality</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">24/7 support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300">Multiple Format</span>
                    </li>
                  </ul>
                  <SignUpButton>
                    <Button variant="outline" className="w-full bg-red-700 hover:bg-red-600 hover:text-white border-none text-white text-sm sm:text-base">Choose Plan</Button>
                  </SignUpButton>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center px-2 sm:px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">
              Ready to Create Viral Thumbnails?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
              Join thousands of creators who trust ThumbnailAI for their YouTube success
            </p>
            <SignUpButton>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg group w-full sm:w-auto" size="lg">
                Start Creating for Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 ml-2" />
              </Button>
            </SignUpButton>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center text-gray-400">
              <p className="text-sm sm:text-base">&copy; 2025 Toenail AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}