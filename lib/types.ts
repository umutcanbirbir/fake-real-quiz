export type QuizAnswer = "fake" | "real";
export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "text" | "image" | "news";

export type QuizQuestion = {
  id: string;
  category: string;
  question_type: QuestionType;
  content: string;
  image_url: string | null;
  headline: string | null;
  excerpt: string | null;
  source_name: string | null;
  source_url: string | null;
  active_date: string | null;
  answer: QuizAnswer;
  explanation: string;
  difficulty: QuizDifficulty;
  is_published: boolean;
  is_in_daily_pool: boolean;
  is_in_hardcore_pool: boolean;
  is_in_online_pool: boolean;
  tags: string[];
  usage_count: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
};
