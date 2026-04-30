import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { getUserFromAccessToken } from "@/lib/supabase-server";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  const token = (await cookies()).get("sb_access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUserFromAccessToken(token);
  if (!user?.email || !env.adminEmails.includes(user.email.toLowerCase())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (!allowed.has(file.type) || file.type === "image/svg+xml") return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  if (file.size > 3 * 1024 * 1024) return NextResponse.json({ error: "File too large" }, { status: 400 });

  const filePath = `questions/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const uploadRes = await fetch(`${env.supabaseUrl}/storage/v1/object/question-images/${filePath}`, {
    method: "POST",
    headers: { apikey: env.supabaseServiceRoleKey, Authorization: `Bearer ${env.supabaseServiceRoleKey}`, "Content-Type": file.type, "x-upsert": "true" },
    body: file,
  });
  if (!uploadRes.ok) return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  return NextResponse.json({ path: filePath, publicUrl: `${env.supabaseUrl}/storage/v1/object/public/question-images/${filePath}` });
}
