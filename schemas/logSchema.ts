import { z } from "zod";

export const LogSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  action: z
    .string()
    .min(5, "Action description must have at least 5 characters"),
  timestamp: z.string().datetime(),
});

export type Log = z.infer<typeof LogSchema>;
