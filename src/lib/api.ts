import { ClientePayload, PrediccionResponse } from "../types/churnApi";

export async function predictChurn(payload: ClientePayload): Promise<PrediccionResponse> {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  const baseUrl =
    env.NEXT_PUBLIC_CHURN_API_URL ||
    env.VITE_CHURN_API_URL ||
    (typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_CHURN_API_URL : undefined) ||
    "https://churnback-production.up.railway.app";

  const res = await fetch(`${baseUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Error en la API: ${res.status}`);
  }

  return res.json();
}
