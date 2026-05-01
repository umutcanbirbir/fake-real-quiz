"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { QuizQuestion, QuestionType } from "@/lib/types";

type FormState = Partial<QuizQuestion> & { id?: string };
const blank: FormState = { question_type: "text", answer: "real", difficulty: "easy", is_published: false };

function getContentTypeLabel(questionType: QuestionType) {
  if (questionType === "image") return "AI Image";
  if (questionType === "news") return "News Check";
  return "Text Check";
}

export default function AdminManager({ initial }: { initial: QuizQuestion[] }) {
  const [questions, setQuestions] = useState(initial);
  const [form, setForm] = useState<FormState>(blank);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSaveDisabled = busy || uploading;

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

  const uploadImage = async (file?: File) => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: data });
      const json = await res.json();

      if (!res.ok || !json.publicUrl) {
        throw new Error(json.error || "Upload failed. Please try again.");
      }

      setForm((f) => ({ ...f, image_url: String(json.publicUrl) }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (uploading) return;

    setBusy(true);
    const res = await fetch("/api/admin/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setBusy(false);
    if (!res.ok) return;
    window.location.reload();
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/questions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image_url: null }));
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded border border-zinc-800 p-4 lg:grid-cols-2">
        <div className="grid gap-2">
          <input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded bg-zinc-900 p-2" />
          <select value={form.question_type ?? "text"} onChange={(e) => setForm({ ...form, question_type: e.target.value as QuestionType })} className="rounded bg-zinc-900 p-2">
            <option value="text">text</option><option value="image">image</option><option value="news">news</option>
          </select>
          <textarea value={form.content ?? ""} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Question" className="rounded bg-zinc-900 p-2" />

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
          <input type="date" value={form.active_date ?? ""} onChange={(e) => setForm({ ...form, active_date: e.target.value })} className="rounded bg-zinc-900 p-2" /><select value={form.answer ?? "real"} onChange={(e) => setForm({ ...form, answer: e.target.value as "real" | "fake" })} className="rounded bg-zinc-900 p-2"><option value="real">real</option><option value="fake">fake</option></select><textarea value={form.explanation ?? ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Explanation" className="rounded bg-zinc-900 p-2" /><label className="text-sm"><input type="checkbox" checked={Boolean(form.is_published)} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label><button onClick={save} disabled={isSaveDisabled} className="rounded bg-cyan-500 p-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">{uploading ? "Wait for upload..." : form.id ? "Update" : "Create"}</button>
        </div>

        <section className="w-full rounded-3xl border border-violet-400/20 bg-zinc-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/80">Preview mode</p>
          <div className="mt-4 rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-violet-300/60 bg-violet-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-200">{previewQuestion.category}</span>
              <span className="rounded-full border border-zinc-500/80 bg-zinc-800/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-200">{getContentTypeLabel(previewQuestion.question_type)}</span>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-zinc-700/80 bg-zinc-950/40 p-4 sm:p-5">
            {previewQuestion.question_type === "news" ? (
              <>
                {previewQuestion.image_url ? <Image src={previewQuestion.image_url} alt={previewQuestion.headline ?? "News prompt"} width={1200} height={700} className="mb-4 h-auto w-full rounded-2xl border border-zinc-700/80 object-cover shadow-lg shadow-black/35" unoptimized /> : null}
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{previewQuestion.source_name || "Unknown Source"}</p>
                <h3 className="mt-2 text-lg font-bold leading-snug text-zinc-100">{previewQuestion.headline || previewQuestion.content}</h3>
                <p className="mt-3 text-zinc-300">{previewQuestion.excerpt || previewQuestion.content}</p>
              </>
            ) : previewQuestion.question_type === "image" ? (
              <>
                <p className="mb-3 text-sm text-zinc-300">{previewQuestion.content}</p>
                {previewQuestion.image_url ? <Image src={previewQuestion.image_url} alt="Question visual" width={1200} height={800} className="h-auto w-full rounded-2xl border border-zinc-700/80 object-cover shadow-lg shadow-black/35" unoptimized /> : <p className="rounded-xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">Upload or paste an image URL to preview the main visual.</p>}
              </>
            ) : (
              <>
                {previewQuestion.image_url ? <Image src={previewQuestion.image_url} alt="Question visual" width={1200} height={700} className="mb-4 h-auto w-full rounded-2xl border border-zinc-700/80 object-cover shadow-lg shadow-black/35" unoptimized /> : null}
                <p className="text-lg leading-relaxed text-zinc-100">{previewQuestion.content}</p>
              </>
            )}
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button disabled className="min-h-14 cursor-not-allowed rounded-2xl border border-emerald-400/60 bg-emerald-500/15 px-5 py-4 text-base font-extrabold uppercase tracking-wide text-emerald-200 opacity-70">fake</button>
            <button disabled className="min-h-14 cursor-not-allowed rounded-2xl border border-rose-400/60 bg-rose-500/15 px-5 py-4 text-base font-extrabold uppercase tracking-wide text-rose-200 opacity-70">real</button>
          </div>
        </section>
      </div>
      <ul className="space-y-2">{questions.map((q) => <li key={q.id} className="rounded border border-zinc-800 p-3"><p className="font-medium">{q.content}</p><p className="text-xs text-zinc-400">{q.question_type} · {q.is_published ? "Published" : "Draft"}</p><div className="mt-2 flex gap-2"><button onClick={() => setForm(q)} className="rounded bg-violet-600 px-2 py-1 text-sm">Edit</button><button onClick={() => remove(q.id)} className="rounded bg-rose-600 px-2 py-1 text-sm">Delete</button></div></li>)}</ul>
    </div>
  );
}
