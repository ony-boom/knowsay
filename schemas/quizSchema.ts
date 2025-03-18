import { z } from "zod";
import { CategorySchema } from "./categorySchema";

export const QuizSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Quiz title must be at least 3 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  is_public: z.boolean().default(true),
  description: z.string().nullable(), // Newly added column
  created_by: z.string().nullable(),
  created_at: z.string(),
});

export const QuizSchemaWithCategory = QuizSchema.extend({
  categories: CategorySchema.pick({
    id: true,
    name: true,
    slug: true,
  }),
});

export const QuizArraySchema = z.array(QuizSchema);

export const QuizArraySchemaWithCategory = z.array(QuizSchemaWithCategory);

export type Quiz = z.infer<typeof QuizSchema>;
