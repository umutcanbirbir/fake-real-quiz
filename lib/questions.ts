import { env } from "@/lib/env";
import type { QuizQuestion } from "@/lib/types";

async function fetchQuestions(query: string): Promise<QuizQuestion[]> {
  const res = await fetch(`${env.supabaseUrl}/rest/v1/questions?${query}`, {
    headers: { apikey: env.supabaseAnonKey, Authorization: `Bearer ${env.supabaseAnonKey}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getPublishedQuestions(limit = 10): Promise<QuizQuestion[]> {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return [];
  const today = new Date().toISOString().slice(0, 10);
  const todayQuestions = await fetchQuestions(`select=*&is_published=eq.true&active_date=eq.${today}&order=created_at.desc&limit=${limit}`);
  if (todayQuestions.length >= limit) return todayQuestions.slice(0, limit);
  const exclude = todayQuestions.map((q) => `id.neq.${q.id}`).join(",");
  const fallbackQuery = `select=*&is_published=eq.true${exclude ? `&and=(${exclude})` : ""}&order=created_at.desc&limit=${limit - todayQuestions.length}`;
  const fallback = await fetchQuestions(fallbackQuery);
  return [...todayQuestions, ...fallback].slice(0, limit);
}
