import { z } from "zod";

export const AnswerSchema = z.object({
  id: z.string().uuid(),
  question_id: z.string().uuid(),
  content: z.string().min(1, "Answer cannot be empty"),
  is_correct: z.boolean(),
  created_at: z.string().datetime(),
});

export type Answer = z.infer<typeof AnswerSchema>;
