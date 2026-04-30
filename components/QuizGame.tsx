"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { QuizAnswer, QuizQuestion } from "@/lib/types";

export default function QuizGame({ questions }: { questions: QuizQuestion[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const scorePercent = useMemo(() => Math.round((correctCount / Math.max(questions.length,1)) * 100), [correctCount, questions.length]);

  if (!questions.length) {
    return <section className="w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900/80 p-6 text-zinc-200">No published questions yet. Check back soon.</section>;
  }

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleAnswer = (answer: QuizAnswer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) setCorrectCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  const shareText = `I scored ${correctCount}/${questions.length} (${scorePercent}%) on Fake or Real Quiz. Can you beat me?`;

  if (isFinished) return <section className="w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-zinc-900/80 p-6"><p className="text-5xl font-black text-cyan-300">{correctCount}/{questions.length}</p><button onClick={async()=>{await navigator.clipboard.writeText(shareText);setCopied(true);setTimeout(()=>setCopied(false),1600);}} className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950">{copied?"Copied!":"Copy Share Text"}</button></section>;

  return <section className="w-full max-w-xl rounded-2xl border border-violet-400/25 bg-zinc-900/80 p-5 sm:p-6"><p className="text-sm text-zinc-400">Question {currentIndex + 1}/{questions.length}</p><h2 className="mt-5 text-xl font-semibold text-zinc-100">{currentQuestion.content}</h2>{currentQuestion.question_type === "image" && currentQuestion.image_url ? <Image src={currentQuestion.image_url} alt="Question" width={900} height={600} className="mt-4 h-auto w-full rounded-xl" /> : null}<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{(["real","fake"] as const).map((choice)=><button key={choice} onClick={()=>handleAnswer(choice)} disabled={Boolean(selectedAnswer)} className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-bold uppercase text-zinc-100">{choice}</button>)}</div>{selectedAnswer && <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4"><p className="text-zinc-200">{currentQuestion.explanation}</p><button onClick={handleNext} className="mt-4 rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white">{currentIndex === questions.length - 1 ? "See Results" : "Next"}</button></div>}</section>;
}
