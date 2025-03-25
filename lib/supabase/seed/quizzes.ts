import { createQuiz } from "@/lib/actions/create-quiz";

const userIDS = [
  "ca5d4ce0-b48b-4103-8813-1f09d3759432",
  "373b4e1b-c0ad-4072-900b-bd2090f77445",
];

const DATA = [
  // General Knowledge
  {
    title: "World Trivia",
    description: "Test your knowledge on various topics from around the world",
    category_id: "bb4ac967-80c6-4001-bd2c-99473c09676e", // General Knowledge
    difficulty: "EASY",
    is_public: true,
  },
  {
    title: "Advanced General Knowledge",
    description: "Challenging questions across multiple domains",
    category_id: "bb4ac967-80c6-4001-bd2c-99473c09676e", // General Knowledge
    difficulty: "HARD",
    is_public: true,
  },

  // Science
  {
    title: "Basic Science Concepts",
    description: "Fundamental principles of physics, chemistry and biology",
    category_id: "842ce722-71c2-4b2b-b947-498ef5d1202f", // Science
    difficulty: "EASY",
    is_public: true,
  },
  {
    title: "Advanced Scientific Theories",
    description: "Complex scientific concepts and recent discoveries",
    category_id: "842ce722-71c2-4b2b-b947-498ef5d1202f", // Science
    difficulty: "HARD",
    is_public: true,
  },

  // Math
  {
    title: "Basic Arithmetic",
    description: "Simple math problems for beginners",
    category_id: "3d5a88ff-3cd4-45c2-8d93-1a4b67b55f1d", // Math
    difficulty: "EASY",
    is_public: true,
  },
  {
    title: "Advanced Calculus",
    description: "Complex mathematical problems and theorems",
    category_id: "3d5a88ff-3cd4-45c2-8d93-1a4b67b55f1d", // Math
    difficulty: "HARD",
    is_public: false,
  },

  // Programming
  {
    title: "Coding Fundamentals",
    description: "Basic programming concepts and syntax",
    category_id: "62a70d16-fa95-4928-a8e3-9488d4f9b83d", // Programming
    difficulty: "EASY",
    is_public: true,
  },
  {
    title: "Advanced Algorithms",
    description: "Complex algorithmic problems and data structures",
    category_id: "62a70d16-fa95-4928-a8e3-9488d4f9b83d", // Programming
    difficulty: "HARD",
    is_public: true,
  },

  // History
  {
    title: "Ancient Civilizations",
    description: "Explore the wonders of early human societies",
    category_id: "12959d28-4dd9-4ec7-9131-7224a5486ade", // History
    difficulty: "MEDIUM",
    is_public: true,
  },

  // Movies
  {
    title: "Classic Films",
    description: "Test your knowledge of iconic movies from cinema history",
    category_id: "729c2e25-55b6-4e06-a88d-e9f06f919973", // Movies
    difficulty: "MEDIUM",
    is_public: true,
  },

  // Music
  {
    title: "Music Theory",
    description: "Basic concepts in music theory and composition",
    category_id: "004fcd48-1c98-4cf6-836d-8f96bb45a889", // Music
    difficulty: "MEDIUM",
    is_public: true,
  },

  // Sports
  {
    title: "Olympic Games",
    description: "History and facts about the Olympic Games",
    category_id: "d0c7c39f-072d-4182-98a8-aa0a96285da4", // Sports
    difficulty: "MEDIUM",
    is_public: true,
  },
].map((quiz) => ({
  ...quiz,
  creator_id: userIDS[Math.floor(Math.random() * userIDS.length)],
}));

export function seedQuizzes() {
  const all = DATA.map((quiz) => {
    return createQuiz(quiz);
  });

  return Promise.all(all);
}
