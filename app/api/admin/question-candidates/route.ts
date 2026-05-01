import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

function sanitizeQuestionType(value: unknown) {
  const parsed = String(value ?? "text");
  return parsed === "news" || parsed === "image" ? parsed : "text";
}

function sanitizeAnswer(value: unknown) {
  return String(value ?? "real") === "fake" ? "fake" : "real";
}

function sanitizeDifficulty(value: unknown) {
  const parsed = String(value ?? "easy");
  return parsed === "medium" || parsed === "hard" ? parsed : "easy";
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
  const body = await req.json();
  const action = String(body.action ?? "");
  const id = String(body.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (action === "reject") {
    const rejectRes = await adminDb(`question_candidates?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected", updated_at: new Date().toISOString() }),
      headers: { Prefer: "return=minimal" },
    });
    return NextResponse.json({}, { status: rejectRes.ok ? 200 : 500 });
  }

  if (action !== "approve") return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const candidateRes = await adminDb(`question_candidates?id=eq.${id}&select=*`);
  if (!candidateRes.ok) return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  const candidates = await candidateRes.json();
  const candidate = candidates?.[0];
  if (!candidate || candidate.status !== "pending") return NextResponse.json({ error: "Candidate not pending" }, { status: 400 });

  const questionPayload = {
    category: String(candidate.suggested_category ?? "General").trim() || "General",
    question_type: sanitizeQuestionType(candidate.suggested_question_type),
    content: String(candidate.suggested_content ?? "").trim() || String(candidate.raw_title ?? "").trim() || "Candidate content missing",
    image_url: null,
    headline: candidate.suggested_headline ? String(candidate.suggested_headline).trim() : null,
    excerpt: candidate.suggested_excerpt ? String(candidate.suggested_excerpt).trim() : null,
    source_name: candidate.source_name ? String(candidate.source_name).trim() : null,
    source_url: candidate.source_url ? String(candidate.source_url).trim() : null,
    active_date: null,
    answer: sanitizeAnswer(candidate.suggested_answer),
    explanation: String(candidate.suggested_explanation ?? "").trim() || "Pending editorial explanation.",
    difficulty: sanitizeDifficulty(candidate.suggested_difficulty),
    is_published: false,
    is_in_daily_pool: true,
    is_in_hardcore_pool: false,
    is_in_online_pool: false,
    tags: Array.isArray(candidate.suggested_tags) ? candidate.suggested_tags.map((tag: unknown) => String(tag).trim()).filter(Boolean) : [],
    archived: false,
  };

  const createQuestionRes = await adminDb("questions", {
    method: "POST",
    body: JSON.stringify(questionPayload),
    headers: { Prefer: "return=minimal" },
  });
  if (!createQuestionRes.ok) return NextResponse.json({ error: "Question create failed" }, { status: 500 });

  const approveRes = await adminDb(`question_candidates?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "approved", updated_at: new Date().toISOString() }),
    headers: { Prefer: "return=minimal" },
  });

  return NextResponse.json({}, { status: approveRes.ok ? 200 : 500 });
}
