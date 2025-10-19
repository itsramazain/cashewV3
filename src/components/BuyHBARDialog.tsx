// src/components/ui/BuyHBARDialog.tsx
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { ethers } from "ethers"; // v5

// --- Vite env (frontend) ---
const V_TREASURY = import.meta.env.VITE_TREASURY_EVM_ADDRESS ?? "0.0.6932633";
const V_API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const V_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 296);
const V_NETWORK = (import.meta.env.VITE_NETWORK || "").toLowerCase();
const HASHSCAN_BASE =
  import.meta.env.VITE_HASHSCAN_BASE ??
  `https://hashscan.io/${
    V_NETWORK ||
    (V_CHAIN_ID === 295
      ? "mainnet"
      : V_CHAIN_ID === 296
      ? "testnet"
      : "previewnet")
  }`;

// tiny guards
const isEvm = (v?: string) => /^0x[a-fA-F0-9]{40}$/.test(v || "");

type Status = null | {
  ref: string; // tx hash or server tx id
  state: "pending" | "completed" | "error";
  kind: "wallet" | "server";
  note?: string;
};

export default function BuyHBARDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("1"); // HBAR amount
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingServer, setLoadingServer] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const qc = useQueryClient();

  // ---- provider helpers (ethers v5) ----
  const ensureEthereum = () => {
    const eth = (window as any)?.ethereum;
    if (!eth) throw new Error("MetaMask not found");
    return eth;
  };

  const getProvider = () => {
    const eth = ensureEthereum();
    return new ethers.providers.Web3Provider(eth);
  };

  const ensureExpectedChain = async (
    provider: ethers.providers.Web3Provider
  ) => {
    const net = await provider.getNetwork();
    const chainId = Number(net.chainId);
    if (chainId !== V_CHAIN_ID) {
      throw new Error(`Please switch MetaMask to chainId ${V_CHAIN_ID}.`);
    }
  };

  // ---- Connect button handler (no external utils) ----
  const onConnectClick = async () => {
    try {
      setConnecting(true);
      const eth = ensureEthereum();

      // Ask accounts explicitly on user gesture
      const accounts: string[] = await eth.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts?.[0];
      if (!addr) throw new Error("No accounts returned from MetaMask");
      setAccount(addr);

      toast.success("Wallet connected");
    } catch (e: any) {
      const msg = e?.message || String(e);
      toast.error(msg);
    } finally {
      setConnecting(false);
    }
  };

  // Keep account in sync if user switches in MetaMask
  useEffect(() => {
    const eth = (window as any)?.ethereum;
    if (!eth || !eth.on) return;

    const handleAccounts = (accs: string[]) => setAccount(accs?.[0] ?? "");
    eth.on("accountsChanged", handleAccounts);

    return () => {
      try {
        eth.removeListener?.("accountsChanged", handleAccounts);
      } catch {}
    };
  }, []);

  // Try to read existing account on mount (silent)
  useEffect(() => {
    (async () => {
      try {
        const eth = (window as any)?.ethereum;
        if (!eth?.request) return;
        const accounts: string[] = await eth.request({
          method: "eth_accounts",
        });
        if (accounts?.length) setAccount(accounts[0]);
      } catch {}
    })();
  }, []);

  // A) user → treasury (MetaMask pops)
  const sendWithMetaMask = async () => {
    setStatus(null);
    try {
      if (!isEvm(V_TREASURY))
        throw new Error("VITE_TREASURY_EVM_ADDRESS is missing/invalid");
      if (!amount || Number(amount) <= 0)
        throw new Error("Enter a positive amount");

      setLoadingWallet(true);

      // Ensure we have a connected account
      if (!account) {
        await onConnectClick();
        if (!account) throw new Error("Please connect MetaMask first");
      }

      const provider = getProvider();
      await ensureExpectedChain(provider);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: V_TREASURY,
        value: ethers.utils.parseEther(String(amount)), // HBAR has 18 decimals on Hedera EVM
      });

      setStatus({
        ref: tx.hash,
        state: "pending",
        kind: "wallet",
        note: "Waiting for confirmation…",
      });

      const receipt = await tx.wait(); // 1 confirmation
      const h =
        (receipt as any)?.transactionHash || (receipt as any)?.hash || tx.hash;
      if (h) {
        setStatus({ ref: h, state: "completed", kind: "wallet" });
        toast.success(`Sent ${amount} HBAR to treasury`);
        qc.invalidateQueries({ queryKey: ["balances"] });
        qc.invalidateQueries({ queryKey: ["trades"] });
      }
    } catch (e: any) {
      const msg = e?.message || String(e);
      setStatus({ ref: "", state: "error", kind: "wallet", note: msg });
      toast.error(msg);
    } finally {
      setLoadingWallet(false);
    }
  };

  // B) (optional) server → user (needs backend running)
  const requestFromServer = async () => {
    setStatus(null);
    try {
      if (!V_API_BASE) throw new Error("VITE_BACKEND_URL is not set");
      setLoadingServer(true);

      // Ensure we have a connected account
      if (!account) {
        await onConnectClick();
        if (!account) throw new Error("Please connect MetaMask first");
      }

      const provider = getProvider();
      await ensureExpectedChain(provider);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();

      const r = await fetch(`${V_API_BASE}/sendHbar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: addr, hbarAmount: Number(amount) }),
      });
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        throw new Error(`HTTP ${r.status} ${t}`);
      }
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "Server returned error");

      setStatus({
        ref: data.txId || "(see server logs)",
        state: "completed",
        kind: "server",
      });
      toast.success("Treasury sent HBAR");
      qc.invalidateQueries({ queryKey: ["balances"] });
      qc.invalidateQueries({ queryKey: ["trades"] });
    } catch (e: any) {
      const msg = e?.message || String(e);
      setStatus({ ref: "", state: "error", kind: "server", note: msg });
      toast.error(msg);
    } finally {
      setLoadingServer(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative overflow-hidden bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 transition-all duration-300 hover:shadow-[#ddb146]/40 hover:scale-[1.02] w-full sm:w-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="relative z-10">Buy HBAR</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 text-white shadow-2xl max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#ddb146]/20 to-[#f4c563]/20 border border-white/10">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#ddb146]" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Buy HBAR
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 pt-3 sm:pt-4">
          {/* Address Row */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
              Your EVM Address
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="0x..."
                className="bg-white/5 border-white/10 text-white text-sm sm:text-base h-11 sm:h-12 rounded-xl focus:border-[#ddb146]/50 focus:ring-2 focus:ring-[#ddb146]/20 transition-all font-mono"
              />
              <Button
                variant="secondary"
                onClick={onConnectClick}
                disabled={connecting}
                className="h-11 sm:h-12 bg-white/10 border-white/10 hover:bg-white/20 disabled:opacity-50"
              >
                {connecting ? "Connecting…" : "Connect"}
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
              <span>Amount (HBAR)</span>
            </label>
            <div className="relative">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min={0}
                step={"0.000000000000000001"}
                className="bg-white/5 border-white/10 text-white text-base sm:text-lg h-11 sm:h-12 pl-3 sm:pl-4 pr-16 rounded-xl focus:border-[#ddb146]/50 focus:ring-2 focus:ring-[#ddb146]/20 transition-all"
                placeholder="1"
              />
              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium text-sm">
                HBAR
              </span>
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Minimum: 0.000000000000000001 HBAR
            </p>
          </div>

          {/* Status Display */}
          {status && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {status.state === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                ) : status.state === "pending" ? (
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1 overflow-hidden">
                  <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider">
                    {status.kind === "wallet"
                      ? "Wallet Transaction"
                      : "Server Transfer"}
                  </p>
                  {status.ref && (
                    <p className="text-xs sm:text-sm break-all flex items-center gap-2">
                      <span className="font-mono text-white/90">
                        {status.ref.slice(0, 10)}…
                      </span>
                      {status.kind === "wallet" && (
                        <a
                          href={`${HASHSCAN_BASE}/tx/${status.ref}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-white/70 hover:text-white/90 underline"
                        >
                          <LinkIcon className="w-3 h-3" /> View
                        </a>
                      )}
                      <span
                        className={`font-semibold ${
                          status.state === "completed"
                            ? "text-green-400"
                            : status.state === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {status.state}
                      </span>
                    </p>
                  )}
                  {status.note && (
                    <p className="text-xs text-white/60">{status.note}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              disabled={loadingWallet}
              onClick={sendWithMetaMask}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 transition-all duration-300 hover:shadow-[#ddb146]/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
            >
              {loadingWallet ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Send (MetaMask → Treasury)
                </span>
              )}
            </Button>

            <Button
              disabled={loadingServer}
              onClick={requestFromServer}
              variant="secondary"
              className="w-full h-11 sm:h-12 bg-white/10 border-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
            >
              {loadingServer ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Requesting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Request (Server → You)
                </span>
              )}
            </Button>
          </div>

          {/* Info Footer */}
          <div className="pt-2 sm:pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 text-center">
              Wallet flow uses Hedera EVM (chainId {V_CHAIN_ID}). Server flow
              POSTs to <code className="font-mono">{V_API_BASE}/sendHbar</code>.
            </p>
            <p className="text-[10px] text-white/40 text-center mt-1">
              Treasury:{" "}
              <code className="font-mono">
                {V_TREASURY || "(set VITE_TREASURY_EVM_ADDRESS)"}
              </code>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
