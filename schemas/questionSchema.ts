import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  type: z.enum(["QCM", "OPEN", "ORDER", "MATCHING"]),
  content: z.string().min(5, "Question must have at least 5 characters"),
  image_url: z.string().url().optional(),
  timer: z.number().positive().optional(),
  created_at: z.string().datetime(),
});

export type Question = z.infer<typeof QuestionSchema>;
