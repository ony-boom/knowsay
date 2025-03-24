import { z } from "zod";

export const quizAttemptAnswerSchema = z.object({
  id: z.string().uuid(),
  quiz_attempt_id: z.string().uuid(),
  question_id: z.string().uuid(),
  selected_options: z.array(z.string().uuid()).nullable(),
  is_timeout: z.boolean().default(false),
  is_correct: z.boolean().nullable(),
  submitted_at: z.string().datetime(),
});

export type QuizAttemptAnswer = z.infer<typeof quizAttemptAnswerSchema>;
