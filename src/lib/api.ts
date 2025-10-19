import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Helper to poll any GET endpoint until predicate returns true or times out
export async function poll<T = any>(
  url: string,
  predicate: (data: T) => boolean,
  { intervalMs = 1000, timeoutMs = 90_000 }: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<T> {
  const start = Date.now();
  while (true) {
    const { data } = await api.get<T>(url);
    if (predicate(data)) return data;
    if (Date.now() - start > timeoutMs) throw new Error("Polling timeout");
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}