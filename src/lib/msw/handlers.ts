import { http, HttpResponse } from "msw";

let fakeStatus: Record<string,string> = {};
let trades: any[] = [
  { id: "t1", side: "BUY", asset: "HBAR", amount: 120, status: "SETTLED", createdAt: new Date().toISOString() },
  { id: "t2", side: "SELL", asset: "HBAR", amount: 50, status: "LOCKED", createdAt: new Date().toISOString() },
];

export const handlers = [
  http.get("/api/balances", () => HttpResponse.json([
    { currency: "HBAR", available: 1523.77, locked: 120.00 }
  ])),

  http.get("/api/locks", () => HttpResponse.json([
    { currency: "HBAR", amount: 120.0, reason: "Escrow for order #t2" }
  ])),

  http.get("/api/trades", () => HttpResponse.json(trades)),

  http.post("/api/buy", async ({ request }) => {
    const id = crypto.randomUUID();
    fakeStatus[id] = "pending";
    setTimeout(()=> { fakeStatus[id] = "completed"; }, 2500);
    trades = [{ id, side: "BUY", asset: "HBAR", amount: 50, status: "PENDING", createdAt: new Date().toISOString() }, ...trades];
    return HttpResponse.json({ paymentRef: id, status: fakeStatus[id] });
  }),
  http.post("/api/transfer", async ({ request }) => {
  const body = await request.json();
  console.log("Mock transfer:", body);
  return HttpResponse.json({ status: "success" });
}),


  http.get("/api/buy/:ref", ({ params }) =>
    HttpResponse.json({ paymentRef: params.ref, status: fakeStatus[String(params.ref)] || "pending" })
  ),
];
