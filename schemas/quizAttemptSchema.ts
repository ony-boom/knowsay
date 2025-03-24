import { z } from "zod";

export const quizAttemptSchema = z.object({
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  user_id: z.string().uuid(),
  challenge_id: z.string().uuid().nullable(),
  status: z.enum(["in_progress", "completed", "abandoned"]),
  score: z.number().int().default(0),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().nullable(),
});

export type QuizAttempt = z.infer<typeof quizAttemptSchema>;
