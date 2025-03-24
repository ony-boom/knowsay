import { z } from "zod";

export const testCorrectorSchema = z.object({
  id: z.string().uuid(),
  test_id: z.string().uuid(),
  corrector_id: z.string().uuid(),
  status: z.enum(["pending", "accepted", "declined"]).default("pending"),
  assigned_at: z.string().datetime(),
  response_at: z.string().datetime().nullable(),
});

export type TestCorrector = z.infer<typeof testCorrectorSchema>;
