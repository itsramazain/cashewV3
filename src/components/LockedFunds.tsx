import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Lock, Shield, Loader2, AlertCircle } from "lucide-react";

function LockedFunds() {
  const { data, isLoading } = useQuery({
    queryKey: ["locks"],
    queryFn: async () => (await api.get("/api/locks")).data,
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3 text-white/60 py-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading locked funds...</span>
        </div>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center gap-3 text-white/40 py-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-sm">No funds currently locked</span>
        </div>
      </Card>
    );
  }

  const totalLocked = data.reduce((acc: number, lock: any) => {
    // Simple sum - in production you'd convert currencies properly
    return acc + Number(lock.amount);
  }, 0);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Locked Funds (Escrow)</h2>
              <p className="text-xs text-white/60 mt-0.5">Funds held in secure escrow</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60 uppercase tracking-wider">Total Items</div>
            <div className="text-2xl font-bold text-white">{data.length}</div>
          </div>
        </div>
      </div>

      {/* Locked Funds List */}
      <div className="divide-y divide-white/5">
        {data.map((lock: any, i: number) => (
          <div
            key={i}
            className="p-4 hover:bg-white/5 transition-colors duration-150 group"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Currency */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-400">
                    {lock.currency.slice(0, 2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/90">{lock.currency}</span>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {lock.reason}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {Number(lock.amount).toLocaleString()}
                </div>
                <div className="text-xs text-amber-400/80">Locked</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Shield className="w-4 h-4" />
            <span>Protected by escrow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Total:</span>
            <span className="font-bold text-white">{totalLocked.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LockedFunds;