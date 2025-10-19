import { useState } from "react";
import { TrendingUp, Lock, Zap, BarChart3 } from "lucide-react";
import logoImage from "/Cashew logo.jpg";

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ddb146]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20">
          

        {/* Logo */}
        <div className="flex justify-center mb-12 sm:mb-16">
        <img 
            src={logoImage} 
            alt="HBAR Trading Platform Logo" 
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain"
        />
        </div>
          {/* Hero Content */}
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Trade HBAR with
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#f4c563] via-[#ddb146] to-[#f4c563] bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
                Secure, fast, and intuitive cryptocurrency trading platform. Buy, sell, and manage your HBAR with ease.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#ddb146] to-[#f4c563] font-semibold text-slate-900 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#ddb146]/50 w-full sm:w-auto"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-white/20 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 w-full sm:w-auto">
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#ddb146]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ddb146]/20 to-[#f4c563]/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#f4c563]" />
                </div>
                <h3 className="text-xl font-bold">Secure Wallet</h3>
                <p className="text-white/60">Bank-grade security with multi-signature authentication and cold storage protection.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#ddb146]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ddb146]/20 to-[#f4c563]/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#f4c563]" />
                </div>
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-white/60">Instant transactions powered by Hedera's high-performance distributed ledger technology.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#ddb146]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ddb146]/20 to-[#f4c563]/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#f4c563]" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Analytics</h3>
                <p className="text-white/60">Track your portfolio with advanced analytics and real-time market data insights.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ddb146] to-[#f4c563] bg-clip-text text-transparent">
                $2.5B+
              </div>
              <div className="text-white/60">Trading Volume</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ddb146] to-[#f4c563] bg-clip-text text-transparent">
                500K+
              </div>
              <div className="text-white/60">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ddb146] to-[#f4c563] bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-white/60">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-[#ddb146] to-[#f4c563] rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                How It Works
              </h2>
            </div>
            <p className="text-white/60 text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: 1, title: "Create Account", desc: "Sign up in minutes with email verification and secure your account with 2FA." },
              { num: 2, title: "Fund Your Wallet", desc: "Deposit funds using bank transfer, card payment, or crypto transfer." },
              { num: 3, title: "Start Trading", desc: "Buy, sell, and trade HBAR with our intuitive trading interface." }
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ddb146] to-[#f4c563] flex items-center justify-center text-2xl font-bold text-slate-900">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-white/60">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#ddb146]/10 to-[#f4c563]/10 backdrop-blur-xl p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-white/80 text-lg">Join thousands of traders already using our platform</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#ddb146] to-[#f4c563] font-semibold text-slate-900 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#ddb146]/50"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-white/60">
          <p>&copy; 2025 HBAR Trading Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}