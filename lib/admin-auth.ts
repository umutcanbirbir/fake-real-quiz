import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { getUserFromAccessToken } from "@/lib/supabase-server";

export async function requireAdmin() {
  const token = (await cookies()).get("sb_access_token")?.value;
  if (!token) throw new Error("Unauthorized");
  const user = await getUserFromAccessToken(token);
  if (!user?.email || !env.adminEmails.includes(user.email.toLowerCase())) throw new Error("Forbidden");
  return user;
}
