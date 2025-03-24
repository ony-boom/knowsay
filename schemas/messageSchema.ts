import { z } from "zod";
export const messageSchema = z.object({
  message_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  content: z.string(),
  is_read: z.boolean().default(false),
  created_at: z.string().datetime(),
});

export type Message = z.infer<typeof messageSchema>;
