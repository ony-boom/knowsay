import { z } from "zod";
import { qcmSchema } from "./qcmSchema";

export const quizQuestionSchema = z.object({
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  qcm_id: z.string().uuid(),
  position: z.number().int().positive(),
  time_limit: z.number().int().positive(),
  points: z.number().int().nonnegative(),
});

export const quizQuestionWithQcmSchema = quizQuestionSchema.extend({
  qcm: qcmSchema,
});

export const storeQuizQuestionSchema = quizQuestionSchema.omit({
  id: true,
  position: true,
});

export type QuizQuestionWithQcm = z.infer<typeof quizQuestionWithQcmSchema>;

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export type StoreQuizQuestion = z.infer<typeof storeQuizQuestionSchema>;
