import { z } from "zod";

export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Challenge title must be at least 3 characters"),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  created_by: z.string().uuid(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;
