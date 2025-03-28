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
    start_time: z.string(),
    end_time: z.string().refine(
      (val) => {
        const endDate = new Date(val);
        return !isNaN(endDate.getTime()) && endDate > new Date();
      },
      {
        message: "End time must be after the current time",
      },
    ),
    is_team_based: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_time);
      const endDate = new Date(data.end_time);
      return (
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime()) &&
        startDate < endDate
      );
    },
    {
      message: "Start time must be before end time",
      path: ["end_time"],
    },
  );

export type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

export type Challenge = z.infer<typeof challengeSchema>;
