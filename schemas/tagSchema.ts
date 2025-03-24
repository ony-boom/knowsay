import { z } from "zod";

export const tagSchema = z.object({
  tag_id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
});

export type Tag = z.infer<typeof tagSchema>;
