import { z } from "zod";

export const testQuestionSchema = z.object({
  id: z.string().uuid(),
  test_id: z.string().uuid(),
  qcm_id: z.string().uuid(),
  is_free_text: z.boolean().default(false),
  position: z.number().int().positive(),
  time_limit: z.number().int().positive().nullable(),
  points: z.number().int().positive(),
});

export type TestQuestion = z.infer<typeof testQuestionSchema>;
