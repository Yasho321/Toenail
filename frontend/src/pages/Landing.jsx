import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check, Play, Star, Users, Zap, ArrowRight, ImageIcon, Download, Upload, MessageSquare, X, ArrowDown, Crown, Sparkles, Shield, Clock } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Crimson Core Glow */}
      <div
        className="fixed inset-0 z-1 "
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
        }}
      />
      {/* Soft vignette to blend edges */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
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
                  <img src="./logo.png" alt="Toenail AI Logo" />
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
          <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Hook */}
              <div className="mb-6 sm:mb-8">
                <p className="text-lg sm:text-xl lg:text-2xl text-red-400 font-medium mb-2">
                  Why pay ₹1000 for a thumbnail when AI makes it in 2 minutes for ₹49?
                </p>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 text-white">
                YouTube Thumbnails
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  That Demand Attention
                </span>
              </h1>
              
              {/* Promise */}
              <div className="mb-8 sm:mb-12">
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed px-2">
                  Upload your photo → Answer 4 quick questions → Share us your vision →  Get your attention-grabbing YouTube thumbnail → editable with simple chat prompts.
                </p>
              </div>
              
              {/* Pricing Hero */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-400 line-through">₹1,000</span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-500">₹49</span>
                <span className="text-sm sm:text-base lg:text-lg text-gray-300">per thumbnail</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-2">
                <SignUpButton>
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg group w-full sm:w-auto" size="lg">
                    Start Creating Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 ml-2" />
                  </Button>
                </SignUpButton>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 sm:px-8 py-3 text-base sm:text-lg group w-full sm:w-auto" size="lg" onClick={() => {
                  document.getElementById("demo-video")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white px-2">
                How It Works
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                From photo to viral thumbnail in just 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  STEP 1
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Upload Your Photo</h3>
                <p className="text-gray-300">
                  Simply upload your photo and tell us about your video content
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  STEP 2
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">AI Creates & Chat Edits</h3>
                <p className="text-gray-300">
                  Our AI generates your thumbnail, then refine it using simple chat prompts
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  STEP 3
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Download & Upload</h3>
                <p className="text-gray-300">
                  Download your high-quality thumbnail and watch your views soar
                </p>
              </div>
            </div>

            {/* Demo Video */}
            <div className="text-center">
              <div className="max-w-4xl mx-auto" id="demo-video" >
                <video 
                  width="100%" 
                  height="400" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg border border-red-600/30 shadow-2xl bg-black/20 backdrop-blur-sm"
                  poster="https://ik.imagekit.io/toenail/Reference-image/Untitled%20video%20-%20Made%20with%20Clipchamp%20(31).mp4/ik-thumbnail.jpg?updatedAt=1758797924875"
                >
                  <source 
                    src="https://ik.imagekit.io/toenail/Reference-image/Untitled%20video%20-%20Made%20with%20Clipchamp%20(31).mp4?updatedAt=1758797924875" 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Before vs After Showcase */}
         <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white px-2">
                See The Transformation
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                Real creators, real results. See how ordinary photos become viral thumbnails.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Example 1 */}
              <div className="text-center">
                <div className="space-y-4 mb-4">
                  <div>
                    <p className="text-red-400 font-semibold mb-2">Before</p>
                    <img 
                      src="./pexels-hiteshchoudhary-18681382.jpg" 
                      alt="Before thumbnail" 
                      className="w-full aspect-video object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                  <div className="flex justify-center">
                    <ArrowDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold mb-2">After</p>
                    <img 
                      src="https://ik.imagekit.io/toenail/thumbnail-img/PUBG_First_Time_Gameplay_Thumbnail_Edit-thumbnail1758797091317_cZbp7fB9G.png?updatedAt=1758797105813" 
                      alt="After thumbnail" 
                      className="w-full aspect-video object-cover rounded-lg border border-red-600"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">Gaming Content Creator</p>
              </div>

              {/* Example 2 */}
              <div className="text-center">
                <div className="space-y-4 mb-4">
                  <div>
                    <p className="text-red-400 font-semibold mb-2">Before</p>
                    <img 
                      src="https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=1080&q=75" 
                      alt="Before thumbnail" 
                      className="w-full aspect-video object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                  <div className="flex justify-center">
                    <ArrowDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold mb-2">After</p>
                    <img 
                      src="https://ik.imagekit.io/toenail/thumbnail-img/Creating_an_AI_Girlfriend__Step-by-Step_Guide_with_Pink_Floral_Aesthetic_Thumbnail-thumbnail1_Lvxc2bHYL.png?updatedAt=1758796082649" 
                      alt="After thumbnail" 
                      className="w-full aspect-video object-cover rounded-lg border border-red-600"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">Tech Tutorial Creator</p>
              </div>

              {/* Example 3 */}
              <div className="text-center">
                <div className="space-y-4 mb-4">
                  <div>
                    <p className="text-red-400 font-semibold mb-2">Before</p>
                    <img 
                      src="./pexels-hiteshchoudhary-18681382.jpg" 
                      alt="Before thumbnail" 
                      className="w-full aspect-video object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                  <div className="flex justify-center">
                    <ArrowDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold mb-2">After</p>
                    <img 
                      src="https://ik.imagekit.io/toenail/thumbnail-img/Thumbnail_design_request_for_top_5_bicep_exercises_video-thumbnail1758794339581_iV-xqLTHJ.png?updatedAt=1758794352861" 
                      alt="After thumbnail" 
                      className="w-full aspect-video object-cover rounded-lg border border-red-600"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">Fitness Content Creator</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Not Canva/Designer Section */}
       <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white px-2">
                Toenail AI vs Traditional Tools
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                See why creators choose Toenail AI over Canva, Photoshop, and freelance designers
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Toenail AI Card */}
              <Card className="p-6 sm:p-8 backdrop-blur-sm bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    RECOMMENDED
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12  rounded-full flex items-center justify-center">
                      <img src="./logo.png" className="rounded-full"/>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Toenail <span className="text-red-600">AI</span></h3>
                      <p className="text-red-300 text-sm">Smart AI-Powered Solution</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <span className="text-gray-300 font-medium">Price per thumbnail</span>
                    <span className="text-green-400 font-bold text-xl">₹49</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <span className="text-gray-300 font-medium">Time to create</span>
                    <span className="text-green-400 font-bold text-xl">2 minutes</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Conversational editing with chat</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">YouTube CTR optimized</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">No design skills needed</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Personalized AI learning</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Instant results</span>
                    </div>
                  </div>
                </div>
                <SignUpButton>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold">
                  Start Creating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                </SignUpButton>
              </Card>

              {/* Traditional Tools Card */}
              <Card className="p-6 sm:p-8 backdrop-blur-sm bg-white/5 border-gray-600/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    OUTDATED
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Traditional Tools</h3>
                      <p className="text-gray-400 text-sm">Canva, Photoshop, Designers</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <span className="text-gray-300 font-medium">Price per thumbnail</span>
                    <span className="text-red-400 font-bold text-xl">₹1000+</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <span className="text-gray-300 font-medium">Time to create</span>
                    <span className="text-red-400 font-bold text-xl">2+ hours</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">Manual design process</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">Generic templates</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">Requires design expertise</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">No personalization</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">Time-consuming process</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-gray-600 text-gray-400 py-3 text-lg font-semibold cursor-not-allowed" disabled>
                  Outdated Method
                  <X className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card className="p-6 text-center backdrop-blur-sm bg-white/10 border-red-500/30">
                <div className="text-3xl font-bold text-red-400 mb-2">60x</div>
                <div className="text-gray-300 text-sm">Faster than traditional methods</div>
              </Card>
              
              <Card className="p-6 text-center backdrop-blur-sm bg-white/10 border-red-500/30">
                <div className="text-3xl font-bold text-red-400 mb-2">95%</div>
                <div className="text-gray-300 text-sm">Cost savings vs hiring designers</div>
              </Card>
              
              
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
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Conversational Editing</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Refine your thumbnails with simple chat prompts - no design skills needed.
                </p>
              </Card>

              <Card className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">YouTube Optimized</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Designed specifically for YouTube CTR and virality. Perfect dimensions and formats.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
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
                     10 AI Thumbnails
                  </p>
                 <p className="text-white/60 mb-4 sm:mb-6 lg:mb-8 bg-black/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/5 text-sm">
                    ₹{Math.round( 800/  10)} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span>10 AI-generated thumbnails</span>
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

                  
                    <SignInButton>
                      <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                 
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
                     25 AI Thumbnails
                  </p>
                  <p className="text-white/60 mb-4 sm:mb-6 lg:mb-8 bg-black/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/5 text-sm">
                    ₹{Math.round( 1400 /  25)} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span> 25 AI-generated thumbnails</span>
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

                  
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                  
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
                     50 AI Thumbnails
                  </p>
                  <p className="text-white/60 mb-4 sm:mb-6 lg:mb-8 bg-black/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/5 text-sm">
                    ₹{Math.round( 2450 /  50)} per thumbnail
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span> 50 AI-generated thumbnails</span>
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

                  
                    <SignInButton>
                      <Button className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                        Sign In to Purchase
                      </Button>
                    </SignInButton>
                 
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

        {/* Final CTA Section */}
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
                Sign Up and Get 3 Free Tokens
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 ml-2" />
              </Button>
            </SignUpButton>
          </div>
        </section>

        {/* Footer */}
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