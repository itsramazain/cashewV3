import { useMemo, useState } from "react";
import { api, poll } from "@/lib/api";

export default function WithdrawDialog() {
  const [open, setOpen] = useState(false);
  const [asset, setAsset] = useState("HBAR");
  const [amount, setAmount] = useState<number>(0);
  const [to, setTo] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const canSubmit = useMemo(() => asset && amount > 0 && to && !ref, [asset, amount, to, ref]);

  const startWithdraw = async () => {
    try {
      const { data } = await api.post("/api/withdraw", { asset, amount, to });
      setRef(data.withdrawRef);
      setStatus(data.status);
      // poll
      const res = await poll(`/api/withdraw/${data.withdrawRef}`, (d: any) => d.status === "COMPLETED" || d.status === "FAILED", { intervalMs: 1200, timeoutMs: 180_000 });
      setStatus(res.status);
    } catch (e) {
      alert("Withdrawal failed to start.");
    }
  };

  const reset = () => {
    setAsset("HBAR");
    setAmount(0);
    setTo("");
    setRef(null);
    setStatus(null);
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setOpen(true)} className="border border-neutral-700 rounded-xl px-4 py-2 hover:bg-neutral-900">Withdraw</button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Withdraw</h3>
              <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100">✕</button>
            </div>

            {!ref ? (
              <div className="space-y-3">
                <label className="block text-sm">
                  Asset
                  <select value={asset} onChange={(e) => setAsset(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
                    <option value="HBAR">HBAR</option>
                    <option value="tHBAR">tHBAR</option>
                  </select>
                </label>
                <label className="block text-sm">
                  Amount
                  <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2" />
                </label>
                <label className="block text-sm">
                  Hedera Address
                  <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0.0.x or 0x…" className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2" />
                </label>
                <button disabled={!canSubmit} onClick={startWithdraw} className="w-full rounded-xl bg-white/10 py-2 hover:bg-white/15 disabled:opacity-50">Confirm</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-neutral-800 p-3">
                  <div className="text-sm opacity-80">Reference</div>
                  <div className="font-mono text-lg">{ref}</div>
                </div>
                <div className="rounded-xl border border-neutral-800 p-3">
                  <div className="text-sm opacity-80">Status</div>
                  <div className="text-base font-medium">{status}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-neutral-800 py-2">Close</button>
                  {status && (
                    <button onClick={() => { setOpen(false); reset(); }} className="flex-1 rounded-xl bg-white/10 py-2 hover:bg-white/15">New Withdrawal</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}