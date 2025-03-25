import { z } from "zod";

export type User = {
  id?: string;
  name: string;
  password_hash?: string;
  role: "USER" | "CORRECTOR" | "ADMIN";
  email: string;
};

export const storeQuizSchema = z.object({
  title: z.string().nonempty("Title is required"),
  category_id: z.string().nonempty("Category is required"),
  difficulty: z.string().nonempty("Difficulty is required"),
  description: z.string().nonempty("Description is required"),
  is_public: z.boolean(),
});

export type StoreQuiz = z.infer<typeof storeQuizSchema>;
export type Category = {
  id: string;
  name: string;
};

export type Quiz = {
  quiz_id: string;
  title: string;
  description: string;
  difficulty: QuizDifficulty;
  category_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  creator_id: string;
};

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";
