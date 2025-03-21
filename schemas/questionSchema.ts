import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  type: z.enum(["QCM", "OPEN", "ORDER", "MATCHING"]),
  content: z.string().min(5, "Question must have at least 5 characters"),
  timer: z.number().positive().optional(),
  created_at: z.coerce.date(),
});

export const StoreQuestionSchema = QuestionSchema.omit({
  id: true,
  created_at: true,
}).extend({
  content: z.string().min(5, "Question must have at least 5 characters"),
  timer: z.number().positive().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

export type StoreQuestion = z.infer<typeof StoreQuestionSchema>;
