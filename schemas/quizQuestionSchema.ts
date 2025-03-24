import { z } from "zod";

export const quizQuestionSchema = z.object({
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  qcm_id: z.string().uuid(),
  position: z.number().int().positive(),
  time_limit: z.number().int().positive(),
  points: z.number().int().nonnegative(),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
