import { z } from "zod";

export const quizRatingSchema = z.object({
  rating_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().nullable(),
  created_at: z.string().datetime(),
});

export type QuizRating = z.infer<typeof quizRatingSchema>;
