import { z } from "zod";

export const qcmSchema = z.object({
  qcm_id: z.string().uuid(),
  question: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const storeQcmSchema = qcmSchema
  .omit({
    qcm_id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    question: z.string().min(1, "Question is required"),
  });

export type StoreQCM = z.infer<typeof storeQcmSchema>;

export type QCM = z.infer<typeof qcmSchema>;
