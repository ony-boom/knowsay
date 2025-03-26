import { z } from "zod";

export const challengeSchema = z.object({
  challenge_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  is_team_based: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createChallengeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.string().datetime(),
    end_time: z
      .string()
      .datetime()
      .refine((val) => new Date(val) > new Date(), {
        message: "End time must be after the current time",
      }),
    is_team_based: z.boolean().default(false),
  })
  .refine((data) => new Date(data.start_time) < new Date(data.end_time), {
    message: "Start time must be before end time",
    path: ["end_time"],
  });

export type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

export type Challenge = z.infer<typeof challengeSchema>;
