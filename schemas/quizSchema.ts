import { z } from "zod";

export const QuizSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Quiz title must be at least 3 characters"),
  category: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  is_public: z.boolean().default(true),
  description: z.string().nullable(), // Newly added column
  created_by: z.string().nullable(),
  created_at: z.string(),
});

export const QuizzArraySchema = z.array(QuizSchema);

export type Quiz = z.infer<typeof QuizSchema>;
