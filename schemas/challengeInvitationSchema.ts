import { z } from "zod";

export const challengeInvitationSchema = z.object({
  invitation_id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  team_id: z.string().uuid(),
  email: z.string().email(),
  token: z.string(),
  is_registered: z.boolean().default(false),
  created_at: z.string().datetime(),
  accepted_at: z.string().datetime().nullable(),
});

export type ChallengeInvitation = z.infer<typeof challengeInvitationSchema>;
