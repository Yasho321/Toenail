import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check, Play, Star, Users, Zap, ArrowRight, ImageIcon, Download, Upload, MessageSquare, X, ArrowDown, Crown, Sparkles, Shield, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden selection:bg-red-500/30">
      
      {/* --- Background Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.08) 0%, rgba(0, 0, 0, 0) 30%)",
          }}
        />
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  <img src="./logo.png" alt="Toenail AI Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold tracking-tight">Toenail <span className="text-red-500">AI</span></span>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  to="/signin" 
                  className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-black hover:bg-gray-200 font-semibold text-sm px-4 py-2 rounded-full transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Hook Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              AI-Powered Viral Thumbnails
            </div>
              
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Stop Overpaying for <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent">
                YouTube Thumbnails
              </span>
            </h1>
              
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Why pay <span className="text-gray-300 line-through decoration-red-500/50">₹1000</span>? Get professional, high-CTR thumbnails for just <span className="text-white font-bold">₹49</span> in seconds. Upload, describe, and let AI do the heavy lifting.
            </p>
              
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/signup"  
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
              >
                Start Creating <ArrowRight className="w-5 h-5" />
              </Link>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-gray-200 px-8 py-7 rounded-lg text-lg h-auto backdrop-blur-sm"
                onClick={() => document.getElementById("demo-video")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Watch Demo
              </Button>
            </div>

            {/* Demo Video Container */}
            <div className="relative max-w-5xl mx-auto mt-12" id="demo-video">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur opacity-20"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl">
                <div className="absolute top-0 w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <video 
                  width="100%" 
                  height="auto" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-video object-cover pt-8"
                >
                  <source 
                    src="/demo.mp4"
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 border-t border-white/5 relative bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">From Idea to <span className="text-red-500">Viral</span> in 3 Steps</h2>
              <p className="text-gray-400">No design skills required. Just your vision and our AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent border-t border-dashed border-white/10" />

              {[
                { icon: Upload, title: "Upload & Describe", desc: "Upload your photo and give a brief description of your video." },
                { icon: Sparkles, title: "AI Generation", desc: "Our AI creates a click-worthy thumbnail instantly. Chat to refine details." },
                { icon: Download, title: "Download & Post", desc: "Get high-res files ready for YouTube. Watch your CTR soar." }
              ].map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6 group-hover:border-red-500/50 transition-colors shadow-lg">
                    <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <step.icon className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-3">STEP 0{index + 1}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 max-w-xs text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before vs After Showcase */}
         <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">The <span className="text-red-500">Transformation</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                See how Toenail AI turns ordinary selfies into click-magnet thumbnails.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { 
                  before: "./pexels-hiteshchoudhary-18681382.jpg", 
                  after: "https://ik.imagekit.io/toenail/thumbnail-img/PUBG_First_Time_Gameplay_Thumbnail_Edit-thumbnail1758797091317_cZbp7fB9G.png?updatedAt=1758797105813",
                  cat: "Gaming"
                },
                { 
                  before: "https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=1080&q=75", 
                  after: "https://ik.imagekit.io/toenail/thumbnail-img/Creating_an_AI_Girlfriend__Step-by-Step_Guide_with_Pink_Floral_Aesthetic_Thumbnail-thumbnail1_Lvxc2bHYL.png?updatedAt=1758796082649",
                  cat: "Tech"
                },
                { 
                  before: "./pexels-hiteshchoudhary-18681382.jpg", 
                  after: "https://ik.imagekit.io/toenail/thumbnail-img/Thumbnail_design_request_for_top_5_bicep_exercises_video-thumbnail1758794339581_iV-xqLTHJ.png?updatedAt=1758794352861",
                  cat: "Fitness"
                }
              ].map((item, idx) => (
                <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition-all">
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-red-400 border border-white/10 z-10">BEFORE</span>
                      <img 
                        src={item.before} 
                        alt="Before" 
                        className="w-full aspect-video object-cover rounded-lg border border-white/5 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                      />
                    </div>
                    
                    <div className="flex justify-center -my-6 relative z-10">
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-full p-2">
                        <ArrowDown className="w-5 h-5 text-red-500 animate-bounce" />
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-white border border-red-400/20 z-10">AFTER</span>
                      <img 
                        src={item.after} 
                        alt="After" 
                        className="w-full aspect-video object-cover rounded-lg border border-red-500/30 shadow-[0_0_15px_-5px_rgba(220,38,38,0.3)]"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.cat}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-current" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
       <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Smart Choice</h2>
              <p className="text-gray-400">Why creators are switching to AI generation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Toenail AI Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-200"></div>
                <Card className="relative h-full p-8 bg-[#080808] border-0 rounded-xl overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20">RECOMMENDED</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <img src="./logo.png" className="w-10 h-10 object-contain"/>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Toenail <span className="text-red-500">AI</span></h3>
                      <p className="text-gray-400 text-sm">Automated Intelligence</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <span className="text-gray-400">Cost</span>
                      <span className="text-2xl font-bold text-green-400">₹49 <span className="text-sm font-normal text-gray-500">/ thumb</span></span>
                    </div>
                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <span className="text-gray-400">Time</span>
                      <span className="text-2xl font-bold text-green-400">2 mins</span>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                      {[
                        "Conversational editing via chat",
                        "YouTube CTR optimized layouts",
                        "Zero design skills needed",
                        "Learns your channel style",
                        "Instant variations"
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                          </div>
                          <span className="text-gray-300 text-sm">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <Link to="/signup" className="block w-full bg-red-600 hover:bg-red-500 text-white text-center font-bold py-3 rounded-lg transition-colors">
                      Start Creating Now
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Traditional Card */}
              <Card className="h-full p-8 bg-white/5 border-white/5 rounded-xl grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-white/10 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">TRADITIONAL</span>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Manual Design</h3>
                    <p className="text-gray-400 text-sm">Designers / Photoshop</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-end justify-between border-b border-white/5 pb-4">
                    <span className="text-gray-400">Cost</span>
                    <span className="text-2xl font-bold text-red-400">₹1000+</span>
                  </div>
                  <div className="flex items-end justify-between border-b border-white/5 pb-4">
                    <span className="text-gray-400">Time</span>
                    <span className="text-2xl font-bold text-red-400">2-48 hours</span>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    {[
                      "Manual, tedious revisions",
                      "Generic template look",
                      "Steep learning curve",
                      "No personalization",
                      "Waiting for freelancers"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
                          <X className="w-3 h-3 text-red-400" />
                        </div>
                        <span className="text-gray-400 text-sm">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Button variant="ghost" disabled className="w-full text-gray-500 border border-white/5 cursor-not-allowed">
                    The Old Way
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                 <div className="text-2xl font-bold text-red-500">60x</div>
                 <div className="text-xs text-gray-500 mt-1">Faster Speed</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                 <div className="text-2xl font-bold text-red-500">95%</div>
                 <div className="text-xs text-gray-500 mt-1">Cheaper</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                 <div className="text-2xl font-bold text-red-500">24/7</div>
                 <div className="text-xs text-gray-500 mt-1">Availability</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                 <div className="text-2xl font-bold text-red-500">4k</div>
                 <div className="text-xs text-gray-500 mt-1">Resolution</div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Personalized AI", text: "Learns your brand colors, fonts, and face to keep consistency." },
                { icon: MessageSquare, title: "Chat to Edit", text: "Want the text bigger? Background darker? Just ask in chat." },
                { icon: Crown, title: "YouTube Optimized", text: "Trained on millions of viral videos to maximize click-through rate." }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-red-500/30 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
       <section className="py-24 relative overflow-hidden">
          {/* Background Glow for pricing */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-400">Credits never expire. Pay only for what you generate.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Standard */}
              <div className="p-8 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">₹800</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">10 Thumbnails (₹80/each)</p>
                
                <ul className="space-y-4 mb-8">
                  {["10 AI generations", "720p Resolution", "Basic Support", "Standard Speed"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-gray-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/signin" className="block w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-center font-medium transition-colors">
                  Choose Standard
                </Link>
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
                  <span className="text-4xl font-bold text-white">₹1,400</span>
                </div>
                <p className="text-sm text-red-200/70 mb-6">25 Thumbnails (₹56/each)</p>
                
                <ul className="space-y-4 mb-8">
                  {["25 AI generations", "1080p Ultra HD", "Priority Support", "Fast Processing", "Commercial License"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                         <Check className="w-3 h-3 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/signin" className="block w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white text-center font-bold transition-all shadow-lg shadow-red-900/40">
                  Get Premium
                </Link>
              </div>

              {/* Pro */}
              <div className="p-8 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">₹2,450</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">50 Thumbnails (₹49/each)</p>
                
                <ul className="space-y-4 mb-8">
                  {["50 AI generations", "4K Quality", "24/7 Priority Support", "Instant Processing", "API Access"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-gray-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/signin" className="block w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-center font-medium transition-colors">
                  Choose Pro
                </Link>
              </div>
            </div>

            {/* Included Features */}
            <div className="mt-20 pt-10 border-t border-white/5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { icon: Shield, l: "No Watermarks" },
                  { icon: Clock, l: "No Expiry" },
                  { icon: Sparkles, l: "High Res" },
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

        {/* Final CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="p-1 rounded-2xl bg-gradient-to-r from-red-500/50 via-purple-500/50 to-orange-500/50">
              <div className="bg-[#050505] rounded-xl px-6 py-16 sm:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                    Ready to go <span className="text-red-500">Viral?</span>
                  </h2>
                  <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                    Join thousands of creators who trust Toenail AI to drive millions of views. Sign up today and get 3 free tokens.
                  </p>
                  <Link to="/signup" className="inline-flex items-center justify-center bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all group">
                    Get 3 Free Thumbnails
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
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
                    <img src="./logo.png" className="w-4 h-4" />
                  </div>
                  <span className="font-bold">Toenail AI</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The #1 AI Thumbnail generator for YouTube creators. Boost CTR and save time.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms-conditions" className="hover:text-red-500 transition-colors">Terms & Conditions</a></li>
                  <li><a href="/cancellation-refunds" className="hover:text-red-500 transition-colors">Refund Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link to="/pricing" className="hover:text-red-500 transition-colors">Pricing</Link></li>
                  <li><Link to="/features" className="hover:text-red-500 transition-colors">Features</Link></li>
                  <li><Link to="/showcase" className="hover:text-red-500 transition-colors">Showcase</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="mailto:support@toenailai.com" className="hover:text-white transition-colors">support@toenailai.com</a></li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Systems Operational</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
              <p>&copy; 2026 Toenail AI. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <span>Made with ❤️ for Creators</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}