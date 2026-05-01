import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { adminDb } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";


function normalizeImageUrl(imageUrl: unknown) {
  if (!imageUrl) return null;
  const value = String(imageUrl).trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const normalizedPath = value
    .replace(/^\/+/, "")
    .replace(/^storage\/v1\/object\/public\/question-images\//, "")
    .replace(/^question-images\//, "");
  return `${env.supabaseUrl}/storage/v1/object/public/question-images/${normalizedPath}`;
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (!tags) return [];
  return String(tags).split(",").map((tag) => tag.trim()).filter(Boolean);
}

function bodyToPayload(body: Record<string, unknown>) {
  return {
    category: String(body.category ?? "").trim(),
    question_type: String(body.question_type ?? "text"),
    content: String(body.content ?? "").trim(),
    image_url: normalizeImageUrl(body.image_url),
    headline: body.headline ? String(body.headline) : null,
    excerpt: body.excerpt ? String(body.excerpt) : null,
    source_name: body.source_name ? String(body.source_name) : null,
    source_url: body.source_url ? String(body.source_url) : null,
    active_date: body.active_date ? String(body.active_date) : null,
    answer: String(body.answer ?? "fake"),
    explanation: String(body.explanation ?? "").trim(),
    difficulty: String(body.difficulty ?? "easy"),
    is_published: Boolean(body.is_published),
    is_in_daily_pool: body.is_in_daily_pool === undefined ? true : Boolean(body.is_in_daily_pool),
    is_in_hardcore_pool: Boolean(body.is_in_hardcore_pool),
    is_in_online_pool: Boolean(body.is_in_online_pool),
    tags: normalizeTags(body.tags),
    archived: Boolean(body.archived),
  };
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
  const body = await req.json();
  const payload = bodyToPayload(body);
  if (!payload.category || !payload.content || !payload.explanation) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const id = body.id ? String(body.id) : null;
  const res = await adminDb(id ? `questions?id=eq.${id}` : "questions", { method: id ? "PATCH" : "POST", body: JSON.stringify(payload), headers: { Prefer: "return=representation" } });
  return NextResponse.json(res.ok ? await res.json() : { error: "Save failed" }, { status: res.ok ? 200 : 500 });
}

export async function DELETE(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const res = await adminDb(`questions?id=eq.${id}`, { method: "DELETE" });
  return NextResponse.json({}, { status: res.ok ? 200 : 500 });
}
