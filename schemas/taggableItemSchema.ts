import { z } from "zod";

export const taggableItemSchema = z.object({
  id: z.string().uuid(),
  tag_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  entity_type: z.string(),
});

export type TaggableItem = z.infer<typeof taggableItemSchema>;
