"use client";

import { useState } from "react";
import type { QuizQuestion, QuestionType } from "@/lib/types";

type FormState = Partial<QuizQuestion> & { id?: string };
const blank: FormState = { question_type: "text", answer: "real", difficulty: "easy", is_published: false };

export default function AdminManager({ initial }: { initial: QuizQuestion[] }) {
  const [questions, setQuestions] = useState(initial);
  const [form, setForm] = useState<FormState>(blank);
  const [busy, setBusy] = useState(false);

  const uploadImage = async (file?: File) => {
    if (!file) return;
    const data = new FormData(); data.set("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: data });
    const json = await res.json();
    if (res.ok) setForm((f) => ({ ...f, image_url: json.publicUrl }));
  };

  const save = async () => {
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

  return <div className="space-y-4"><div className="grid gap-2 rounded border border-zinc-800 p-4"><input value={form.category ?? ""} onChange={(e)=>setForm({...form,category:e.target.value})} placeholder="Category" className="rounded bg-zinc-900 p-2"/><select value={form.question_type ?? "text"} onChange={(e)=>setForm({...form,question_type:e.target.value as QuestionType})} className="rounded bg-zinc-900 p-2"><option value="text">text</option><option value="image">image</option><option value="news">news</option></select><textarea value={form.content ?? ""} onChange={(e)=>setForm({...form,content:e.target.value})} placeholder="Question" className="rounded bg-zinc-900 p-2"/>
  {form.question_type === "image" ? <><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>uploadImage(e.target.files?.[0])} className="rounded bg-zinc-900 p-2"/><input value={form.image_url ?? ""} onChange={(e)=>setForm({...form,image_url:e.target.value})} placeholder="Image URL" className="rounded bg-zinc-900 p-2"/></> : null}
  {form.question_type === "news" ? <><input value={form.headline ?? ""} onChange={(e)=>setForm({...form,headline:e.target.value})} placeholder="Headline" className="rounded bg-zinc-900 p-2"/><textarea value={form.excerpt ?? ""} onChange={(e)=>setForm({...form,excerpt:e.target.value})} placeholder="Excerpt" className="rounded bg-zinc-900 p-2"/><input value={form.source_name ?? ""} onChange={(e)=>setForm({...form,source_name:e.target.value})} placeholder="Source name" className="rounded bg-zinc-900 p-2"/><input value={form.source_url ?? ""} onChange={(e)=>setForm({...form,source_url:e.target.value})} placeholder="Source URL" className="rounded bg-zinc-900 p-2"/></> : null}
  <input type="date" value={form.active_date ?? ""} onChange={(e)=>setForm({...form,active_date:e.target.value})} className="rounded bg-zinc-900 p-2"/><select value={form.answer ?? "real"} onChange={(e)=>setForm({...form,answer:e.target.value as "real"|"fake"})} className="rounded bg-zinc-900 p-2"><option value="real">real</option><option value="fake">fake</option></select><textarea value={form.explanation ?? ""} onChange={(e)=>setForm({...form,explanation:e.target.value})} placeholder="Explanation" className="rounded bg-zinc-900 p-2"/><label className="text-sm"><input type="checkbox" checked={Boolean(form.is_published)} onChange={(e)=>setForm({...form,is_published:e.target.checked})}/> Published</label><button onClick={save} disabled={busy} className="rounded bg-cyan-500 p-2 font-semibold text-black">{form.id ? "Update" : "Create"}</button></div><ul className="space-y-2">{questions.map((q)=><li key={q.id} className="rounded border border-zinc-800 p-3"><p className="font-medium">{q.content}</p><p className="text-xs text-zinc-400">{q.question_type} · {q.is_published?"Published":"Draft"}</p><div className="mt-2 flex gap-2"><button onClick={()=>setForm(q)} className="rounded bg-violet-600 px-2 py-1 text-sm">Edit</button><button onClick={()=>remove(q.id)} className="rounded bg-rose-600 px-2 py-1 text-sm">Delete</button></div></li>)}</ul></div>;
}
