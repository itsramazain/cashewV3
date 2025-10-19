import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, CheckCircle2, XCircle, Lock, Loader2 } from "lucide-react";

const badge = (s: string) => {
  const variants: any = {
    PENDING: { variant: "outline", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
    LOCKED: { variant: "secondary", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
    SETTLED: { variant: "default", color: "text-green-400 border-green-400/30 bg-green-400/10" },
    FAILED: { variant: "destructive", color: "text-red-400 border-red-400/30 bg-red-400/10" },
  };
  
  const config = variants[s] ?? { variant: "outline", color: "text-white/60 border-white/20 bg-white/5" };
  
  const icons: any = {
    PENDING: <Clock className="w-3 h-3" />,
    LOCKED: <Lock className="w-3 h-3" />,
    SETTLED: <CheckCircle2 className="w-3 h-3" />,
    FAILED: <XCircle className="w-3 h-3" />,
  };
  
  return (
    <Badge variant={config.variant} className={`${config.color} flex items-center gap-1.5 font-medium text-xs sm:text-sm`}>
      {icons[s]}
      {s}
    </Badge>
  );
};

export default function TradeHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => (await api.get("/api/trades")).data
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#ddb146] to-[#f4c563] rounded-full"></div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Trade History
          </h1>
        </div>

        {/* Table Container */}
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Side
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="text-right px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-3 sm:px-6 py-6 sm:py-8 text-center" colSpan={5}>
                      <div className="flex items-center justify-center gap-3 text-white/60">
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="text-sm sm:text-base">Loading trades...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && data?.length === 0 && (
                  <tr>
                    <td className="px-3 sm:px-6 py-8 sm:py-12 text-center" colSpan={5}>
                      <div className="flex flex-col items-center gap-2 text-white/40">
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="text-sm sm:text-base">No trades yet</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && data?.map((t: any, index: number) => (
                  <tr 
                    key={t.id} 
                    className="border-t border-white/5 hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white/80">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(t.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {t.side === "BUY" ? (
                          <>
                            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                            <span className="text-xs sm:text-sm font-semibold text-green-400">BUY</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                            <span className="text-xs sm:text-sm font-semibold text-red-400">SELL</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-white/90">
                        {t.asset}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {Number(t.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {badge(t.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        {!isLoading && data?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs sm:text-sm text-white/50">
            <span>{data.length} {data.length === 1 ? 'trade' : 'trades'} total</span>
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}