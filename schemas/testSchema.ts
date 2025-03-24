import { z } from "zod";

export const testSchema = z.object({
  test_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Test = z.infer<typeof testSchema>;
