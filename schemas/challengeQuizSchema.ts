import { z } from "zod";
import { quizSchema } from "./quizSchema";

export const challengeQuizSchema = z.object({
  id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  position: z.number().int().positive(),
});

export const challengeQuizWithQuizSchema = challengeQuizSchema.extend({
  quiz: quizSchema,
});

export const createChallengeQuizSchema = z.object({
  challenge_id: z.string().uuid("Please select a valid challenge"),
  quiz_id: z.string().uuid("Please select a valid quiz"),
  position: z.number().int().positive("Position must be a positive integer"),
});

export const createChallengeQuizzesSchema = z.array(
  z.object({
    quiz_id: z.string().uuid("Please select a valid quiz"),
  }),
);

// Schema for array validation
export const challengeQuizArraySchema = z.array(challengeQuizSchema);
export const challengeQuizWithQuizArraySchema = z.array(
  challengeQuizWithQuizSchema,
);

export type ChallengeQuizArray = z.infer<typeof challengeQuizArraySchema>;
export type ChallengeQuizWithQuizArray = z.infer<
  typeof challengeQuizWithQuizArraySchema
>;

export type ChallengeQuizWithQuiz = z.infer<typeof challengeQuizWithQuizSchema>;

export type ChallengeQuiz = z.infer<typeof challengeQuizSchema>;
export type CreateChallengeQuiz = z.infer<typeof createChallengeQuizSchema>;
export type CreateChallengeQuizzes = z.infer<
  typeof createChallengeQuizzesSchema
>;
