import QuizGame from "@/components/QuizGame";
import { getPublishedQuestions } from "@/lib/questions";

export default async function QuizPage() {
  const questions = await getPublishedQuestions(10);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0f172a_0%,#09090b_45%,#020617_100%)] px-4 py-8">
      <QuizGame questions={questions} />
    </main>
  );
}
