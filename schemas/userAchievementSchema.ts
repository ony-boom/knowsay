import { z } from "zod";

export const userAchievementSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  unlocked_at: z.string().datetime(),
});

export type UserAchievement = z.infer<typeof userAchievementSchema>;
