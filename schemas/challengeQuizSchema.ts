import { z } from "zod";

export const challengeQuizSchema = z.object({
  id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  position: z.number().int().positive(),
  created_at: z.coerce.date(),
});

export const createChallengeQuizSchema = z.object({
  challenge_id: z.string().uuid("Please select a valid challenge"),
  quiz_id: z.string().uuid("Please select a valid quiz"),
  position: z.number().int().positive("Position must be a positive integer"),
});

export const createChallengeQuizzesSchema = z.array(
  z.object({
    quiz_id: z.string().uuid("Please select a valid quiz"),
    position: z.number().int().positive("Position must be a positive integer"),
  }),
);

export type ChallengeQuiz = z.infer<typeof challengeQuizSchema>;
export type CreateChallengeQuiz = z.infer<typeof createChallengeQuizSchema>;
export type CreateChallengeQuizzes = z.infer<
  typeof createChallengeQuizzesSchema
>;
