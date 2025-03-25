import { z } from "zod";
import { CategorySchema } from "./categorySchema";

export const quizSchema = z.object({
  quiz_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string().min(3, "Quiz title must be at least 3 characters"),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  category_id: z.string().uuid("Please select a valid category"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  is_public: z.boolean().default(true),
});

export const quizSchemaWithCategory = quizSchema.extend({
  categories: CategorySchema.pick({
    id: true,
    name: true,
    slug: true,
  }),
});

export const quizArraySchema = z.array(quizSchema);

export const quizArraySchemaWithCategory = z.array(quizSchemaWithCategory);

export type Quiz = z.infer<typeof quizSchema>;

export type QuizWithCategory = z.infer<typeof quizSchemaWithCategory>;

export const storeQuizSchema = quizSchema
  .omit({
    quiz_id: true,
    created_at: true,
    updated_at: true,
    creator_id: true,
  })
  .extend({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
      errorMap: () => ({ message: "Please select a valid difficulty level" }),
    }),
    is_public: z.boolean().optional(),
  });

export type StoreQuiz = z.infer<typeof storeQuizSchema>;
