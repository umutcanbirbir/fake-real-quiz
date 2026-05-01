"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { QuizQuestion, QuestionType } from "@/lib/types";

type FormState = Partial<QuizQuestion> & { id?: string; tags_text?: string };
type PublishedFilter = "all" | "published" | "draft";
type PoolFilter = "all" | "daily" | "hardcore" | "online";
type ArchivedFilter = "active" | "archived" | "all";
type TypeFilter = "all" | QuestionType;

const blank: FormState = {
  question_type: "text",
  answer: "real",
  difficulty: "easy",
  is_published: false,
  is_in_daily_pool: true,
  is_in_hardcore_pool: false,
  is_in_online_pool: false,
  archived: false,
  tags: [],
  tags_text: "",
};

function getContentTypeLabel(questionType: QuestionType) {
  if (questionType === "image") return "AI Image";
  if (questionType === "news") return "News Check";
  return "Text Check";
}

function toFormState(question: QuizQuestion): FormState {
  return { ...question, tags_text: (question.tags ?? []).join(", ") };
}

export default function AdminManager({ initial }: { initial: QuizQuestion[] }) {
  const [questions, setQuestions] = useState(initial);
  const [form, setForm] = useState<FormState>(blank);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>("all");
  const [poolFilter, setPoolFilter] = useState<PoolFilter>("all");
  const [archivedFilter, setArchivedFilter] = useState<ArchivedFilter>("active");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSaveDisabled = busy || uploading;

  const filteredQuestions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (typeFilter !== "all" && q.question_type !== typeFilter) return false;
      if (publishedFilter === "published" && !q.is_published) return false;
      if (publishedFilter === "draft" && q.is_published) return false;
      if (poolFilter === "daily" && !q.is_in_daily_pool) return false;
      if (poolFilter === "hardcore" && !q.is_in_hardcore_pool) return false;
      if (poolFilter === "online" && !q.is_in_online_pool) return false;
      if (archivedFilter === "active" && q.archived) return false;
      if (archivedFilter === "archived" && !q.archived) return false;
      if (!searchTerm) return true;
      const fields = [q.content, q.headline, q.category, q.source_name, ...(q.tags ?? [])]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      return fields.some((field) => field.includes(searchTerm));
    });
  }, [questions, search, typeFilter, publishedFilter, poolFilter, archivedFilter]);

  const previewQuestion = useMemo(() => {
    const questionType = (form.question_type ?? "text") as QuestionType;
    return {
      category: form.category?.trim() || "General",
      question_type: questionType,
      content: form.content?.trim() || "Your question content preview will appear here.",
      image_url: form.image_url?.trim() || null,
      headline: form.headline?.trim() || null,
      excerpt: form.excerpt?.trim() || null,
      source_name: form.source_name?.trim() || null,
    };
  }, [form]);

  const uploadImage = async (file?: File) => { if (!file) return; setUploading(true); setUploadError(null); try { const data = new FormData(); data.set("file", file); const res = await fetch("/api/admin/upload-image", { method: "POST", body: data }); const json = await res.json(); if (!res.ok || !json.publicUrl) throw new Error(json.error || "Upload failed. Please try again."); setForm((f) => ({ ...f, image_url: String(json.publicUrl) })); } catch (error) { setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again."); } finally { setUploading(false); } };

  const save = async () => {
    if (uploading) return;
    const payload = {
      ...form,
      tags: String(form.tags_text ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    setBusy(true);
    const res = await fetch("/api/admin/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setBusy(false);
    if (!res.ok) return;
    window.location.reload();
  };

  const remove = async (id: string) => { await fetch("/api/admin/questions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setQuestions((prev) => prev.filter((q) => q.id !== id)); };
  const clearImage = () => { setForm((prev) => ({ ...prev, image_url: null })); setUploadError(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Question Library</h2>
      <div className="rounded border border-zinc-800 p-4">
        <p className="mb-2 text-sm font-semibold">Library Filters</p>
        <div className="grid gap-2 md:grid-cols-5">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content/headline/category/source/tags" className="rounded bg-zinc-900 p-2 md:col-span-2" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)} className="rounded bg-zinc-900 p-2"><option value="all">all types</option><option value="text">text</option><option value="news">news</option><option value="image">image</option></select>
          <select value={publishedFilter} onChange={(e) => setPublishedFilter(e.target.value as PublishedFilter)} className="rounded bg-zinc-900 p-2"><option value="all">all publish states</option><option value="published">published</option><option value="draft">draft</option></select>
          <select value={poolFilter} onChange={(e) => setPoolFilter(e.target.value as PoolFilter)} className="rounded bg-zinc-900 p-2"><option value="all">all pools</option><option value="daily">daily</option><option value="hardcore">hardcore</option><option value="online">online</option></select>
          <select value={archivedFilter} onChange={(e) => setArchivedFilter(e.target.value as ArchivedFilter)} className="rounded bg-zinc-900 p-2"><option value="active">active</option><option value="archived">archived</option><option value="all">all</option></select>
        </div>
      </div>

      <div className="grid gap-4 rounded border border-zinc-800 p-4 lg:grid-cols-2">
        <div className="grid gap-2">
          <input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded bg-zinc-900 p-2" />
          <select value={form.question_type ?? "text"} onChange={(e) => setForm({ ...form, question_type: e.target.value as QuestionType })} className="rounded bg-zinc-900 p-2"><option value="text">text</option><option value="image">image</option><option value="news">news</option></select>
          <textarea value={form.content ?? ""} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Question" className="rounded bg-zinc-900 p-2" />
          <input value={form.tags_text ?? ""} onChange={(e) => setForm({ ...form, tags_text: e.target.value })} placeholder="Tags (comma-separated)" className="rounded bg-zinc-900 p-2" />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label><input type="checkbox" checked={Boolean(form.is_in_daily_pool)} onChange={(e) => setForm({ ...form, is_in_daily_pool: e.target.checked })} /> Daily pool</label>
            <label><input type="checkbox" checked={Boolean(form.is_in_hardcore_pool)} onChange={(e) => setForm({ ...form, is_in_hardcore_pool: e.target.checked })} /> Hardcore pool</label>
            <label><input type="checkbox" checked={Boolean(form.is_in_online_pool)} onChange={(e) => setForm({ ...form, is_in_online_pool: e.target.checked })} /> Online pool</label>
            <label><input type="checkbox" checked={Boolean(form.archived)} onChange={(e) => setForm({ ...form, archived: e.target.checked })} /> Archived</label>
          </div>
          <label className="text-sm"><input type="checkbox" checked={Boolean(form.is_published)} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
          <div className="rounded border border-zinc-700 bg-zinc-950/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Question Image (Optional)</p>
            <p className="mt-1 text-xs text-zinc-400">Upload an image file or paste a full public URL.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => uploadImage(e.target.files?.[0])} className="max-w-full rounded bg-zinc-900 p-2 text-sm" />
              <button type="button" onClick={clearImage} className="rounded border border-zinc-700 px-2 py-1 text-xs font-semibold text-zinc-200 hover:border-zinc-500">Remove image</button>
            </div>
            {uploading ? <p className="mt-2 text-sm font-semibold text-cyan-300">Uploading...</p> : null}
            {uploadError ? <p className="mt-2 text-sm text-rose-300">{uploadError}</p> : null}
            <input value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://... (full public image URL)" className="mt-3 w-full rounded bg-zinc-900 p-2" />
            {form.image_url ? (
              <div className="mt-3">
                <p className="mb-1 text-xs text-zinc-400">Image preview</p>
                <Image src={form.image_url} alt="Uploaded preview" width={220} height={140} className="h-20 w-auto rounded border border-zinc-700 object-cover" unoptimized />
              </div>
            ) : null}
          </div>

          {form.question_type === "news" ? <><input value={form.headline ?? ""} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Headline" className="rounded bg-zinc-900 p-2" /><textarea value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt" className="rounded bg-zinc-900 p-2" /><input value={form.source_name ?? ""} onChange={(e) => setForm({ ...form, source_name: e.target.value })} placeholder="Source name" className="rounded bg-zinc-900 p-2" /><input value={form.source_url ?? ""} onChange={(e) => setForm({ ...form, source_url: e.target.value })} placeholder="Source URL" className="rounded bg-zinc-900 p-2" /></> : null}
          <input type="date" value={form.active_date ?? ""} onChange={(e) => setForm({ ...form, active_date: e.target.value })} className="rounded bg-zinc-900 p-2" /><select value={form.answer ?? "real"} onChange={(e) => setForm({ ...form, answer: e.target.value as "real" | "fake" })} className="rounded bg-zinc-900 p-2"><option value="real">real</option><option value="fake">fake</option></select><textarea value={form.explanation ?? ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Explanation" className="rounded bg-zinc-900 p-2" />
          <button onClick={save} disabled={isSaveDisabled} className="rounded bg-cyan-500 p-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">{uploading ? "Wait for upload..." : form.id ? "Update" : "Create"}</button>
        </div>
        <section className="w-full rounded-3xl border border-violet-400/20 bg-zinc-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/80">Preview mode</p>
          <div className="mt-4 rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-violet-300/60 bg-violet-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-200">{previewQuestion.category}</span>
              <span className="rounded-full border border-zinc-500/80 bg-zinc-800/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-200">{getContentTypeLabel(previewQuestion.question_type)}</span>
            </div>
          </div>
        </section>
      </div>

      <ul className="space-y-2">
        {filteredQuestions.map((q) => (
          <li key={q.id} className={`rounded border p-3 ${q.archived ? "border-zinc-800 bg-zinc-900/30 opacity-60" : "border-zinc-700"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{q.content}</p>
                <p className="text-xs text-zinc-400">{q.question_type} · {q.category} · {q.is_published ? "Published" : "Draft"} · {q.active_date ?? "No active date"}</p>
                <div className="mt-1 flex flex-wrap gap-1 text-xs">
                  {q.is_in_daily_pool ? <span className="rounded bg-cyan-900/60 px-2 py-0.5">Daily</span> : null}
                  {q.is_in_hardcore_pool ? <span className="rounded bg-orange-900/60 px-2 py-0.5">Hardcore</span> : null}
                  {q.is_in_online_pool ? <span className="rounded bg-emerald-900/60 px-2 py-0.5">Online</span> : null}
                  {q.archived ? <span className="rounded bg-zinc-700 px-2 py-0.5">Archived</span> : null}
                </div>
                {q.tags?.length ? <p className="mt-1 text-xs text-zinc-300">Tags: {q.tags.join(", ")}</p> : null}
              </div>
              {q.image_url ? <Image src={q.image_url} alt="Question thumbnail" width={72} height={72} className="h-14 w-14 rounded object-cover" unoptimized /> : null}
            </div>
            <div className="mt-2 flex gap-2"><button onClick={() => setForm(toFormState(q))} className="rounded bg-violet-600 px-2 py-1 text-sm">Edit</button><button onClick={() => remove(q.id)} className="rounded bg-rose-600 px-2 py-1 text-sm">Delete</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
