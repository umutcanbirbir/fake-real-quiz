"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminDb, getUserFromAccessToken } from "@/lib/supabase-server";
import { env } from "@/lib/env";

async function assertAdmin() {
  const token = (await cookies()).get("sb_access_token")?.value;
  if (!token) throw new Error("Unauthorized");
  const user = await getUserFromAccessToken(token);
  if (!user?.email || !env.adminEmails.includes(user.email.toLowerCase())) throw new Error("Forbidden");
}

export async function saveQuestion(formData: FormData) {
  await assertAdmin();
  const payload = {
    category: String(formData.get("category") || "").trim(),
    question_type: String(formData.get("question_type") || "text"),
    content: String(formData.get("content") || "").trim(),
    image_url: String(formData.get("image_url") || "").trim() || null,
    answer: String(formData.get("answer") || "fake"),
    explanation: String(formData.get("explanation") || "").trim(),
    difficulty: String(formData.get("difficulty") || "easy"),
    is_published: formData.get("is_published") === "on",
  };
  if (!payload.category || !payload.content || !payload.explanation) throw new Error("Invalid input");
  const id = formData.get("id");
  if (id) {
    await adminDb(`questions?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(payload), headers: { Prefer: "return=minimal" } });
  } else {
    await adminDb("questions", { method: "POST", body: JSON.stringify(payload), headers: { Prefer: "return=minimal" } });
  }
  revalidatePath("/quiz"); revalidatePath("/admin");
}

export async function deleteQuestion(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Invalid ID");
  await adminDb(`questions?id=eq.${id}`, { method: "DELETE" });
  revalidatePath("/quiz"); revalidatePath("/admin");
}
