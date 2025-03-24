import { z } from "zod";

export const testAttemptAnswerSchema = z
  .object({
    id: z.string().uuid(),
    test_attempt_id: z.string().uuid(),
    question_id: z.string().uuid(),
    selected_options: z.array(z.string().uuid()).nullable(),
    free_text_answer: z.string().nullable(),
    is_timeout: z.boolean().default(false),
    submitted_at: z.string().datetime(),
  })
  .refine(
    (data) => {
      // At least one of selected_options or free_text_answer should be non-null
      if (
        data.selected_options === null &&
        data.free_text_answer === null &&
        !data.is_timeout
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Either selected_options, free_text_answer must be provided, or is_timeout must be true",
    },
  );

export type TestAttemptAnswer = z.infer<typeof testAttemptAnswerSchema>;
