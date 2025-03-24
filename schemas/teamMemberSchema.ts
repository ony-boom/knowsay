import { z } from "zod";

export const teamMemberSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  user_id: z.string().uuid(),
  is_captain: z.boolean().default(false),
  joined_at: z.string().datetime(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
