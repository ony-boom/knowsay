import { z } from "zod";

export const ChallengeParticipantSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  score: z.number().min(0, "Score cannot be negative"),
  rank: z.number().positive().optional(),
  completed_at: z.string().datetime(),
});

export type ChallengeParticipant = z.infer<typeof ChallengeParticipantSchema>;
