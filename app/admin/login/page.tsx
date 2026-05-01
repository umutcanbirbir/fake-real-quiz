import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!env.adminEmails.includes(email)) throw new Error("Not allowlisted");
  const res = await fetch(`${env.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: env.supabaseAnonKey },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  (await cookies()).set("sb_access_token", data.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 30 });
  redirect("/admin");
}

export default function LoginPage() {
  return <main className="min-h-screen bg-zinc-950 p-4 text-zinc-100"><form action={login} className="mx-auto mt-24 max-w-sm space-y-3 rounded border border-zinc-800 p-4"><h1 className="text-xl font-bold">Admin Login</h1><input type="email" name="email" required className="w-full rounded bg-zinc-900 p-2"/><input type="password" name="password" required className="w-full rounded bg-zinc-900 p-2"/><button className="w-full rounded bg-cyan-500 p-2 font-semibold text-black">Sign in</button></form></main>;
}
