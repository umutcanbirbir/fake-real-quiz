"use client";

import { useMemo, useState } from "react";
import { quizQuestions, type QuizAnswer } from "@/data/questions";

export default function QuizGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const isFinished = currentIndex >= quizQuestions.length;

  const scorePercent = useMemo(() => {
    return Math.round((correctCount / quizQuestions.length) * 100);
  }, [correctCount]);

  const handleAnswer = (answer: QuizAnswer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (currentIndex === quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  const shareText = `I scored ${correctCount}/${quizQuestions.length} (${scorePercent}%) on Fake or Real Quiz. Can you beat me?`;

  const copyShareText = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (isFinished) {
    return (
      <section className="w-full max-w-xl rounded-2xl border border-cyan-400/30 bg-zinc-900/80 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Game Over</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Your Final Score</h1>
        <p className="mt-5 text-5xl font-black text-cyan-300">{correctCount}/10</p>
        <p className="mt-2 text-zinc-200">Accuracy: {scorePercent}%</p>
        <button
          onClick={copyShareText}
          className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
        >
          {copied ? "Copied!" : "Copy Share Text"}
        </button>
      </section>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.answer;

  return (
    <section className="w-full max-w-xl rounded-2xl border border-violet-400/25 bg-zinc-900/80 p-5 shadow-[0_0_30px_rgba(139,92,246,0.2)] sm:p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-zinc-400">
        <span>{currentQuestion.category}</span>
        <span>{currentQuestion.difficulty}</span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-zinc-400">
        Question {currentIndex + 1}/{quizQuestions.length}
      </p>

      <h2 className="mt-5 text-xl font-semibold leading-relaxed text-zinc-100 sm:text-2xl">
        {currentQuestion.content}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["real", "fake"] as const).map((choice) => {
          const isSelected = selectedAnswer === choice;
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={Boolean(selectedAnswer)}
              className={`rounded-xl border px-4 py-3 text-base font-bold uppercase tracking-wide transition ${
                isSelected
                  ? "border-cyan-300 bg-cyan-400/20 text-cyan-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-100 hover:border-zinc-500"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
          <p className={`text-lg font-semibold ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
            {isCorrect ? "✅ Correct" : "❌ Wrong"}
          </p>
          <p className="mt-2 text-zinc-200">{currentQuestion.explanation}</p>
          <button
            onClick={handleNext}
            className="mt-4 rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white transition hover:bg-violet-400"
          >
            {currentIndex === quizQuestions.length - 1 ? "See Results" : "Next"}
          </button>
        </div>
      )}
    </section>
  );
}
