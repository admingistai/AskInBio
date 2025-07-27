'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe, Palette, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      content: 'AskInBio transformed how I share my content. The glass design is absolutely stunning!',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Digital Artist',
      content: 'The analytics are game-changing. I can see exactly what my audience loves most.',
      avatar: 'MR',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Entrepreneur',
      content: 'Professional, beautiful, and easy to use. Everything I needed for my business.',
      avatar: 'EW',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      {/* Dynamic Color Mesh Background */}
      <div className="fixed inset-0 color-mesh-bg color-mesh-animated" />
      
      {/* Floating Glass Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(120, 119, 198, 0.3), transparent)',
            filter: 'blur(40px)',
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 94, 105, 0.3), transparent)',
            filter: 'blur(40px)',
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
            right: '15%',
            bottom: '30%'
          }}
        />
      </div>

      {/* Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-white/80" />
              <span className="text-xl font-semibold text-white">AskInBio</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/80 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="
                  inline-flex items-center justify-center
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  px-4 py-2 text-white
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center z-10">
          <div className="glass-card-intense p-8 md:p-12 mb-8 specular-highlight">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              AskInBio,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                powered by GetAskAnything
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Create a stunning, glass-morphism link-in-bio page with powerful analytics.
              Share all your important links in one beautiful place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="
                  inline-flex items-center justify-center gap-2
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  px-8 py-4 text-lg font-medium text-white
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#demo"
                className="
                  inline-flex items-center justify-center gap-2
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  px-8 py-4 text-lg font-medium text-white
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                See Demo
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Floating Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="glass-badge text-white/90">
              <Check className="w-4 h-4" />
              Free Forever
            </div>
            <div className="glass-badge text-white/90">
              <Check className="w-4 h-4" />
              No Credit Card
            </div>
            <div className="glass-badge text-white/90">
              <Check className="w-4 h-4" />
              Analytics Included
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-white/70">
              Powerful features wrapped in beautiful glass design
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="glass-badge inline-flex mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-white/70">
                Optimized performance with instant page loads and smooth animations.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="glass-badge inline-flex mb-4">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-white/70">
                Your data is encrypted and protected with enterprise-grade security.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="glass-badge inline-flex mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Rich Analytics</h3>
              <p className="text-white/70">
                Track clicks, views, and engagement with detailed insights.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="glass-badge inline-flex mb-4">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Custom Domains</h3>
              <p className="text-white/70">
                Use your own domain or choose from our premium options.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="glass-badge inline-flex mb-4">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Themes</h3>
              <p className="text-white/70">
                Customize with stunning themes or create your own unique style.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="glass-badge inline-flex mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Effects</h3>
              <p className="text-white/70">
                Stand out with glass morphism, animations, and specular highlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-white/70">
              Experience the magic of glass design
            </p>
          </div>
          
          <div className="relative max-w-md mx-auto">
            {/* iPhone Frame */}
            <div className="preview-frame rounded-[3rem] overflow-hidden shadow-2xl" style={{ height: '600px' }}>
              <div className="bg-black/80 backdrop-blur-xl h-full">
                {/* Demo Profile */}
                <div className="p-6 pt-16">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                      JD
                    </div>
                    <h3 className="text-xl font-semibold text-white">John Doe</h3>
                    <p className="text-white/70">Creator & Developer</p>
                  </div>
                  
                  {/* Demo Links */}
                  <div className="space-y-3">
                    <div className="glass-link">
                      <span className="text-white">🌐 My Website</span>
                    </div>
                    <div className="glass-link">
                      <span className="text-white">📱 Instagram</span>
                    </div>
                    <div className="glass-link">
                      <span className="text-white">🎥 YouTube Channel</span>
                    </div>
                    <div className="glass-link">
                      <span className="text-white">💼 Portfolio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Try Demo Button */}
            <div className="text-center mt-8">
              <Link
                href="/demo"
                className="
                  inline-flex items-center gap-2
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  px-6 py-3 text-white
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                Try Live Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved By Creators
            </h2>
            <p className="text-xl text-white/70">
              Join thousands of happy users
            </p>
          </div>
          
          <div className="relative">
            <div className="glass-card-intense p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="
                    inline-flex items-center justify-center
                    bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                    border border-white/10 rounded-full
                    shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                    hover:bg-white/[0.08] hover:scale-[1.01]
                    active:scale-[0.99] active:bg-white/[0.04]
                    transition-all duration-300 ease-out
                    p-2 text-white/80 hover:text-white
                  "
                  style={{
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="
                    inline-flex items-center justify-center
                    bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                    border border-white/10 rounded-full
                    shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                    hover:bg-white/[0.08] hover:scale-[1.01]
                    active:scale-[0.99] active:bg-white/[0.04]
                    transition-all duration-300 ease-out
                    p-2 text-white/80 hover:text-white
                  "
                  style={{
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-xl md:text-2xl text-white mb-6 italic">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-white/70 text-sm">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'w-8 bg-white' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/70">
              Start free, upgrade when you need more
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="glass-card p-8 hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-white/70 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-white mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Unlimited links
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Basic analytics
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Standard themes
                </li>
              </ul>
              <Link
                href="/register"
                className="
                  inline-flex items-center justify-center
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  w-full text-center text-white py-3
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                Get Started
              </Link>
            </div>
            
            {/* Pro Tier */}
            <div className="glass-card-intense p-8 hover:scale-[1.02] transition-transform relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="glass-badge text-white">
                  <Sparkles className="w-4 h-4" />
                  Popular
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-white/70 mb-6">For serious creators</p>
              <div className="text-4xl font-bold text-white mb-6">$9<span className="text-lg font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Custom themes
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Priority support
                </li>
              </ul>
              <Link
                href="/register"
                className="
                  inline-flex items-center justify-center
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  w-full text-center text-white py-3
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                Start Pro Trial
              </Link>
            </div>
            
            {/* Business Tier */}
            <div className="glass-card p-8 hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
              <p className="text-white/70 mb-6">For teams and agencies</p>
              <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Team collaboration
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  Custom domain
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-green-400" />
                  API access
                </li>
              </ul>
              <Link
                href="/register"
                className="
                  inline-flex items-center justify-center
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 rounded-full
                  shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  hover:bg-white/[0.08] hover:scale-[1.01]
                  active:scale-[0.99] active:bg-white/[0.04]
                  transition-all duration-300 ease-out
                  w-full text-center text-white py-3
                "
                style={{
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                }}
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative glass-footer mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-white/80" />
                <span className="text-xl font-semibold text-white">AskInBio</span>
              </div>
              <p className="text-white/70">
                Beautiful link-in-bio pages with powerful analytics.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="text-white/70 hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/50">
              © 2024 AskInBio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}