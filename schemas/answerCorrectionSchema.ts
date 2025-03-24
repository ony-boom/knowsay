import { z } from "zod";

export const answerCorrectionSchema = z.object({
  id: z.string().uuid(),
  answer_id: z.string().uuid(),
  corrector_id: z.string().uuid().nullable(),
  score: z.number().int().nonnegative(),
  feedback: z.string().nullable(),
  corrected_at: z.string().datetime(),
});

export type AnswerCorrection = z.infer<typeof answerCorrectionSchema>;
