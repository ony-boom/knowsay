import { z } from "zod";

export const quizTemplateSchema = z.object({
  template_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  structure: z.record(z.any()),
  created_at: z.string().datetime(),
});

export type QuizTemplate = z.infer<typeof quizTemplateSchema>;
