import { z } from "zod";

export const challengeSchema = z.object({
  challenge_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  is_team_based: z.boolean().default(false),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createChallengeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.coerce.date(),
    end_time: z.coerce.date().refine((val) => val > new Date(), {
      message: "End time must be after the current time",
    }),
    is_team_based: z.boolean().default(false),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Start time must be before end time",
    path: ["end_time"],
  });

export type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

export type Challenge = z.infer<typeof challengeSchema>;
