import { z } from "zod";

export const userSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string(),
  full_name: z.string(),
  role: z.enum(["super_admin", "user", "corrector"]),
  created_at: z.string().datetime(),
  last_login: z.string().datetime().nullable(),
});

export type User = z.infer<typeof userSchema>;
