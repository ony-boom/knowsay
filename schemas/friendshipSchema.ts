import { z } from "zod";

export const friendshipSchema = z
  .object({
    friendship_id: z.string().uuid(),
    user_id1: z.string().uuid(),
    user_id2: z.string().uuid(),
    status: z
      .enum(["pending", "accepted", "declined", "blocked"])
      .default("pending"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  })
  .refine((data) => data.user_id1 !== data.user_id2, {
    message: "user_id1 and user_id2 must be different",
  });

export type Friendship = z.infer<typeof friendshipSchema>;
