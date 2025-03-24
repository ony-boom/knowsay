import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  type: z.enum(["QCM", "OPEN"]),
  content: z.string().min(5, "Question must have at least 5 characters"),
  timer: z.number().positive().optional().nullable(),
  order_position: z.number().int().positive(),
  created_at: z.string(),
});

export const StoreQuestionSchema = QuestionSchema.omit({
  id: true,
  order_position: true,
  created_at: true,
}).extend({
  content: z.string().min(5, "Question must have at least 5 characters"),
  timer: z.number().positive().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

export type StoreQuestion = z.infer<typeof StoreQuestionSchema>;

// question array
export const QuestionArraySchema = z.array(QuestionSchema);
