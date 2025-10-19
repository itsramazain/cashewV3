import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  Send,
  User,
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function TransferDialog() {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const handleTransfer = async () => {
    setLoading(true);
    try {
      await api.post("/api/transfer", { recipient, amount: Number(amount) });
      await qc.invalidateQueries({ queryKey: ["balances"] });
      toast.success("Transfer completed successfully");
      setOpen(false);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error(err);
      toast.error("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidRecipient = recipient.match(/^0\.0\.\d+$/);
  const isValidAmount = amount && Number(amount) > 0;
  const canSubmit = isValidRecipient && isValidAmount && !loading;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="relative overflow-hidden bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 transition-all duration-300 hover:shadow-[#ddb146]/40 hover:scale-[1.02] w-full sm:w-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
        <Send className="w-4 h-4 mr-2" />
        <span className="relative z-10">Transfer HBAR</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 text-white shadow-2xl max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#ddb146]/20 to-[#f4c563]/20 border border-white/10">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-[#ddb146]" />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Transfer HBAR
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5 pt-3 sm:pt-4">
            {/* Recipient Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span>Recipient</span>
              </label>
              <div className="relative">
                <Input
                  placeholder="0.0.123456"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-white/5 border-white/10 text-white text-sm sm:text-base h-11 sm:h-12 pl-3 sm:pl-4 pr-10 rounded-xl focus:border-[#ddb146]/50 focus:ring-2 focus:ring-[#ddb146]/20 transition-all"
                />
                {recipient && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValidRecipient ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50">
                Enter Hedera account ID (format: 0.0.xxxxx)
              </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span>Amount</span>
              </label>
              <div className="relative">
                <Input
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white text-base sm:text-lg h-11 sm:h-12 pl-3 sm:pl-4 pr-14 sm:pr-16 rounded-xl focus:border-[#ddb146]/50 focus:ring-2 focus:ring-[#ddb146]/20 transition-all"
                />
                <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium text-sm">
                  HBAR
                </span>
              </div>
              <p className="text-xs text-white/50 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" />
                Minimum transfer: 0.01 HBAR
              </p>
            </div>

            {/* Transfer Preview */}
            {isValidRecipient && isValidAmount && (
              <div className="rounded-xl bg-gradient-to-r from-[#ddb146]/10 to-[#f4c563]/10 border border-[#ddb146]/20 p-3 sm:p-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount</span>
                    <span className="text-white font-semibold">
                      {amount} HBAR
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-white/60">To</span>
                    <span className="text-white font-mono text-xs break-all text-right">
                      {recipient}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between">
                    <span className="text-white/60">Network Fee</span>
                    <span className="text-white/80">~0.0001 HBAR</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 sm:pt-4">
            <Button
              onClick={handleTransfer}
              disabled={!canSubmit}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 transition-all duration-300 hover:shadow-[#ddb146]/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Transferring...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Confirm Transfer
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
