export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
};

export function requireServerEnv() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) throw new Error("Missing server Supabase env vars");
}
