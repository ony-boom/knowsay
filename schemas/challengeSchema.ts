import { z } from "zod";

export const challengeSchema = z.object({
  challenge_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  is_team_based: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Challenge = z.infer<typeof challengeSchema>;
