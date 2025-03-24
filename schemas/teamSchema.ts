import { z } from "zod";

export const teamSchema = z.object({
  team_id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
});

export type Team = z.infer<typeof teamSchema>;
