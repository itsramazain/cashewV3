import { useState } from "react";
import { Wallet, Shield, Key, ExternalLink, CheckCircle2 } from "lucide-react";

export default function Settings() {
  const [useMPC, setUseMPC] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    // Simulate MetaMask connection
    setConnected(!connected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#ddb146] to-[#f4c563] rounded-full"></div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        {/* Wallet Section */}
        <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Section Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#ddb146]/10 to-[#f4c563]/10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-[#ddb146]/20 border border-[#ddb146]/30">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#ddb146]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Wallet Connection</h2>
                <p className="text-xs text-white/60 mt-0.5">Manage your wallet and custody settings</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* MetaMask Connection */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
                Web3 Wallet
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={handleConnect}
                  className={`relative overflow-hidden px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center ${
                    connected
                      ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                      : "bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 hover:shadow-[#ddb146]/40 hover:scale-[1.02]"
                  }`}
                >
                  {connected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Connect MetaMask</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                </button>

                {connected && (
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/5 border border-white/10 w-full sm:w-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-white/80 font-mono">0x742d...3a9f</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50 flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3" />
                Connect your MetaMask wallet to interact with the blockchain
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* MPC Custody Toggle */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
                Custody Options
              </label>
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      MPC Custody
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Multi-Party Computation for enhanced security
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={useMPC}
                    onChange={(e) => setUseMPC(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ddb146]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#b8923a] peer-checked:to-[#ddb146]"></div>
                </label>
              </div>
              {useMPC && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-300">
                    MPC custody mode enabled. Your keys are secured using multi-party computation technology.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Additional Settings Sections (Placeholder) */}
        <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden opacity-50">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-slate-500/20 border border-slate-500/30">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Security & Privacy</h2>
                <p className="text-xs text-white/60 mt-0.5">Coming soon</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}