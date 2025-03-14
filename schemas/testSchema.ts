import { z } from "zod";

export const TestSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Test title must be at least 3 characters"),
  quiz_id: z.string().uuid(),
  corrector_id: z.string().uuid().optional(),
  created_at: z.string().datetime(),
});

export type Test = z.infer<typeof TestSchema>;
