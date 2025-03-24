import { z } from "zod";

export const qcmSchema = z.object({
  qcm_id: z.string().uuid(),
  creator_id: z.string().uuid().nullable(),
  question: z.string(),
  is_public: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type QCM = z.infer<typeof qcmSchema>;
