import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Balance = { currency: string; available: number; locked: number; decimals?: number };

export function useBalances() {
  return useQuery<Balance[]>({
    queryKey: ["balances"],
    queryFn: async () => (await api.get("/api/balances")).data,
    staleTime: 10_000,
  });
}