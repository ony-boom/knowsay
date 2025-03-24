import { z } from "zod";

export const userActivitySchema = z.object({
  activity_id: z.string().uuid(),
  user_id: z.string().uuid(),
  activity_type: z.string(),
  entity_id: z.string().uuid().nullable(),
  entity_type: z.string(),
  details: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
});

export type UserActivity = z.infer<typeof userActivitySchema>;
