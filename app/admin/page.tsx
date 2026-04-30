import { redirect } from "next/navigation";
import { adminDb } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";
import type { QuizQuestion } from "@/lib/types";
import AdminManager from "@/app/admin/components/AdminManager";

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const res = await adminDb("questions?select=*&order=created_at.desc");
  const questions: QuizQuestion[] = res.ok ? await res.json() : [];

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-zinc-100">
      <h1 className="text-2xl font-bold">Admin CMS</h1>
      <p className="mt-1 text-sm text-zinc-400">Create, edit, publish, and delete quiz questions.</p>
      <div className="mt-4">
        <AdminManager initial={questions} />
      </div>
    </main>
  );
}
