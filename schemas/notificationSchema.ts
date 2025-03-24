import { z } from "zod";

export const notificationSchema = z.object({
  notification_id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  related_id: z.string().uuid().nullable(),
  is_read: z.boolean().default(false),
  created_at: z.string().datetime(),
});

export type Notification = z.infer<typeof notificationSchema>;
