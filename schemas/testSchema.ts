import { z } from "zod";

export const testSchema = z.object({
  test_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  start_time: z.coerce.date().nullable(),
  end_time: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createTestSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // Skip validation if not provided
          const endDate = new Date(val);
          return !isNaN(endDate.getTime());
        },
        {
          message: "End time must be a valid date",
        },
      ),
  })
  .refine(
    (data) => {
      // If both dates are provided, validate their relationship
      if (data.start_time && data.end_time) {
        const startDate = new Date(data.start_time);
        const endDate = new Date(data.end_time);
        return (
          !isNaN(startDate.getTime()) &&
          !isNaN(endDate.getTime()) &&
          startDate < endDate
        );
      }
      return true; // If one or both dates are missing, this validation passes
    },
    {
      message: "Start time must be before end time",
      path: ["end_time"],
    },
  );

export type Test = z.infer<typeof testSchema>;
export type CreateTestForm = z.infer<typeof createTestSchema>;
