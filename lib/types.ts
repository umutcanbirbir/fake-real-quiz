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

export type CandidateStatus = "pending" | "approved" | "rejected";

export type QuestionCandidate = {
  id: string;
  source_name: string | null;
  source_url: string | null;
  raw_title: string | null;
  raw_summary: string | null;
  suggested_category: string | null;
  suggested_question_type: QuestionType | null;
  suggested_content: string | null;
  suggested_headline: string | null;
  suggested_excerpt: string | null;
  suggested_answer: QuizAnswer | null;
  suggested_explanation: string | null;
  suggested_difficulty: QuizDifficulty | null;
  suggested_tags: string[];
  suggested_image_prompt: string | null;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
};
