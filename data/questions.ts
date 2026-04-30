export type QuizAnswer = "fake" | "real";

export type QuizQuestion = {
  id: number;
  category: string;
  content: string;
  answer: QuizAnswer;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: "Science",
    content: "Octopuses have three hearts.",
    answer: "real",
    explanation:
      "Two hearts pump blood to the gills, and one pumps blood to the rest of the body.",
    difficulty: "medium",
  },
  {
    id: 2,
    category: "History",
    content: "Napoleon Bonaparte was once attacked by a horde of rabbits.",
    answer: "real",
    explanation:
      "During a staged rabbit hunt, the rabbits ran toward Napoleon instead of away from him.",
    difficulty: "hard",
  },
  {
    id: 3,
    category: "Technology",
    content: "The first computer bug was an actual moth found in hardware.",
    answer: "real",
    explanation:
      "In 1947, operators found a moth in a relay of the Harvard Mark II and logged it as a 'bug'.",
    difficulty: "easy",
  },
  {
    id: 4,
    category: "Animals",
    content: "Sharks are mammals because they give live birth.",
    answer: "fake",
    explanation:
      "Sharks are fish, not mammals. Some lay eggs and some give live birth, but all are fish.",
    difficulty: "medium",
  },
  {
    id: 5,
    category: "Space",
    content: "A day on Venus is longer than a year on Venus.",
    answer: "real",
    explanation:
      "Venus rotates very slowly; one spin takes longer than one trip around the Sun.",
    difficulty: "hard",
  },
  {
    id: 6,
    category: "Geography",
    content: "Iceland is covered entirely in ice while Greenland is mostly green land.",
    answer: "fake",
    explanation:
      "Both names are misleading. Greenland has a huge ice sheet, and Iceland has significant green areas.",
    difficulty: "easy",
  },
  {
    id: 7,
    category: "Food",
    content: "Honey can spoil after a few months even in sealed jars.",
    answer: "fake",
    explanation:
      "Pure honey has very low moisture and high acidity, so it can remain edible for extremely long periods.",
    difficulty: "medium",
  },
  {
    id: 8,
    category: "Sports",
    content: "Golf was once played on the Moon.",
    answer: "real",
    explanation:
      "Apollo 14 astronaut Alan Shepard hit golf balls on the lunar surface in 1971.",
    difficulty: "hard",
  },
  {
    id: 9,
    category: "Language",
    content: "The dot over the lowercase 'i' is called a tittle.",
    answer: "real",
    explanation: "In typography, that small mark above letters like i and j is called a tittle.",
    difficulty: "hard",
  },
  {
    id: 10,
    category: "Nature",
    content: "Bananas grow on trees.",
    answer: "fake",
    explanation:
      "Bananas grow on giant herbs, not trees; the 'trunk' is a pseudostem made of leaf bases.",
    difficulty: "medium",
  },
];
