import { z } from "zod";

export const Balance = z.object({
  currency: z.string(),
  available: z.number(),
  locked: z.number(),
});
export type Balance = z.infer<typeof Balance>;

export const Order = z.object({
  id: z.string(),
  side: z.enum(["BUY","SELL"]),
  asset: z.string(),
  amount: z.number(),
  status: z.enum(["PENDING","LOCKED","SETTLED","FAILED"]),
  createdAt: z.string(),
});
export type Order = z.infer<typeof Order>;
