import { z } from "zod";

export const TestCorrectionSchema = z.object({
  id: z.string().uuid(),
  test_id: z.string().uuid(),
  corrector_id: z.string().uuid(),
  score: z.number().min(0, "Score cannot be negative"),
  feedback: z.string().optional(),
  validated_at: z.string().datetime(),
});

export type TestCorrection = z.infer<typeof TestCorrectionSchema>;
