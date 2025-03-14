import { z } from "zod";

export const ResultSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  score: z.number().min(0, "Score cannot be negative"),
  time_taken: z.number().positive(),
  completed_at: z.string().datetime(),
});

export type Result = z.infer<typeof ResultSchema>;
