import { z } from "zod";

export const testAttemptSchema = z.object({
  id: z.string().uuid(),
  test_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z
    .enum(["in_progress", "completed", "pending_correction", "corrected"])
    .default("in_progress"),
  score: z.number().int().nullable(),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().nullable(),
});

export type TestAttempt = z.infer<typeof testAttemptSchema>;
