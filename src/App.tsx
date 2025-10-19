import { Toaster, toast } from "sonner";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/Landing";
import TradeHistory from "./pages/trade-history";
import Settings from "./pages/settings";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import { Home, History, Settings2, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import cashewLogo from "/Cashew logo.jpg";

export default function App() {
  const location = useLocation();
  const isLoggedIn = true; // TODO replace with real auth
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/history", label: "History", icon: History },
    { path: "/settings", label: "Settings", icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between lg:justify-start gap-4 lg:gap-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-3 group transition-all duration-300 flex-shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ddb146] to-[#f4c563] rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src={cashewLogo}
                  alt="Cashew Logo"
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-lg object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CASHEW
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-gradient-to-r from-[#ddb146]/20 to-[#f4c563]/20 text-white border border-[#ddb146]/30 shadow-lg shadow-[#ddb146]/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex ml-auto items-center gap-3">
              {/* Notification Button */}
              <button
                onClick={() => toast.success("Settlement completed")}
                className="relative flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 group"
              >
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ddb146] rounded-full animate-pulse"></span>
                </div>
                <span className="hidden xl:inline">Notify</span>
              </button>

              {/* User Avatar */}
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ddb146] to-[#f4c563] flex items-center justify-center text-white text-sm font-semibold shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <span>U</span>
              </div>
            </div>

            {/* Mobile Menu Button & User Avatar */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              {/* Mobile Notification */}
              <button
                onClick={() => toast.success("Settlement completed")}
                className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ddb146] rounded-full animate-pulse"></span>
              </button>

              {/* Mobile User Avatar */}
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ddb146] to-[#f4c563] flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                <span>U</span>
              </div>

              {/* Hamburger Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white/10 space-y-2 pb-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-gradient-to-r from-[#ddb146]/20 to-[#f4c563]/20 text-white border border-[#ddb146]/30 shadow-lg shadow-[#ddb146]/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" state={{ from: location }} />
            }
          />
          <Route path="/history" element={<TradeHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 sm:py-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-white/40">
            <div className="flex items-center gap-2">
              <img src={cashewLogo} alt="Cashew" className="w-4 h-4 rounded opacity-60" />
              <span>© 2025 Cashew. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/60 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        richColors 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}