import axios from "axios";

// Use VITE_API_BASE_URL when provided (production or explicit dev override).
// For local development we prefer a relative base URL so Vite dev server proxy
// (configured in vite.config.ts) forwards `/api` requests to the backend
// and avoids CORS / preflight issues with self-signed certs.
const baseURL = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple wrapper to call API endpoints and unwrap data
export async function apiFetch<T = any>(url: string, config?: any): Promise<T> {
  const res = await api(url, config);
  return res.data as T;
}

export default api;
