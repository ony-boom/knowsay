import { z } from "zod";

export const achievementSchema = z.object({
  achievement_id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  icon_url: z.string().nullable(),
  criteria: z.record(z.any()),
  created_at: z.string().datetime(),
});

export type Achievement = z.infer<typeof achievementSchema>;
