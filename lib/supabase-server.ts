import "server-only";
import { env, requireServerEnv } from "@/lib/env";

requireServerEnv();

export async function adminDb(path: string, init?: RequestInit) {
  return fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function getUserFromAccessToken(token: string) {
  const res = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: env.supabaseAnonKey, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ email?: string }>;
}
