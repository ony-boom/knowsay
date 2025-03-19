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

export type QuizWithCategory = z.infer<typeof QuizSchemaWithCategory>;

export const CreateQuizSchema = QuizSchema.omit({
  id: true,
  created_at: true,
  created_by: true,
}).extend({
  categoryId: z.string().uuid("Please select a valid category"),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    errorMap: () => ({ message: "Please select a valid difficulty level" }),
  }),
  is_public: z.boolean().optional(),
});
