import { useBalances } from "@/hooks/useBalances";
import { api } from "@/lib/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BuyHBARDialog from "@/components/BuyHBARDialog";
import LockedFunds from "@/components/LockedFunds";
import TransferDialog from "@/components/TransferDialog";
import { Wallet, Lock, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: balances, isLoading } = useBalances();
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState<null | { ref: string; state: string }>(null);
  const qc = useQueryClient();

  const createBuy = async () => {
    setBuying(true);
    const { data } = await api.post("/api/buy", { amount: 50 });
    setStatus({ ref: data.paymentRef, state: data.status });
    const poll = setInterval(async () => {
      const res = await api.get(`/api/buy/${data.paymentRef}`);
      setStatus({ ref: res.data.paymentRef, state: res.data.status });
      if (res.data.status === "completed") {
        clearInterval(poll);
        setBuying(false);
        qc.invalidateQueries({ queryKey: ["balances"] });
        qc.invalidateQueries({ queryKey: ["trades"] });
      }
    }, 1000);
  };

  const getCurrencyGradient = (currency: string) => {
    const gradients = {
      HBAR: "from-[#ddb146]/10 to-[#f4c563]/10",
      USD: "from-green-500/10 to-emerald-500/10",
      default: "from-slate-500/10 to-gray-500/10"
    };
    return gradients[currency as keyof typeof gradients] || gradients.default;
  };

  const getCurrencyIcon = (currency: string) => {
    return currency === "HBAR" ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#ddb146] to-[#f4c563] rounded-full"></div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {(isLoading ? [1, 2, 3] : balances)?.map((b: any, i: number) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br ${
                isLoading ? "from-slate-800/50 to-slate-900/50" : getCurrencyGradient(b.currency)
              } backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[#ddb146]/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Currency Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      {isLoading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded animate-pulse"></div>
                      ) : (
                        getCurrencyIcon(b.currency)
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white/80">
                      {isLoading ? (
                        <div className="w-12 sm:w-16 h-3 sm:h-4 bg-white/20 rounded animate-pulse"></div>
                      ) : (
                        b.currency
                      )}
                    </span>
                  </div>
                </div>

                {/* Available Balance */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Available
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white">
                    {isLoading ? (
                      <div className="w-24 sm:w-32 h-8 sm:h-10 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      b.available.toLocaleString()
                    )}
                  </div>
                </div>

                {/* Locked Balance */}
                <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-white/10">
                  <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/50" />
                  <span className="text-xs text-white/60">Locked:</span>
                  <span className="text-xs sm:text-sm font-semibold text-white/80">
                    {isLoading ? (
                      <div className="w-12 sm:w-16 h-3 sm:h-4 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      b.locked.toLocaleString()
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Locked Funds Section */}
        <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <LockedFunds />
          </div>
        </section>

        {/* Actions Section */}
        <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <BuyHBARDialog />
              <TransferDialog />
            </div>
            
            {status && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                {status.state === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-400 animate-pulse flex-shrink-0" />
                )}
                <span className="text-xs sm:text-sm text-white/80">
                  Payment{" "}
                  <span className="font-mono text-white/90">
                    {status.ref.slice(0, 8)}…
                  </span>{" "}
                  is{" "}
                  <span
                    className={`font-semibold ${
                      status.state === "completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {status.state}
                  </span>{" "}
                  <span className="text-white/60">via CliQ</span>
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}