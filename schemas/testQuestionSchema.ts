import { z } from "zod";
import { qcmSchema, storeQcmSchema } from "./qcmSchema";

export const testQuestionSchema = z.object({
  id: z.string().uuid(),
  test_id: z.string().uuid(),
  qcm_id: z.string().uuid(),
  is_free_text: z.boolean().default(false),
  position: z.number().int().positive(),
  time_limit: z.number().int().positive().nullable(),
  points: z.number().int().positive(),
});

export const testQuestionWithQcmSchema = testQuestionSchema.extend({
  qcm: qcmSchema,
});

export const storeTestQuestionSchema = testQuestionSchema.omit({
  id: true,
  qcm_id: true,
  position: true,
});

export const storeTestQuestionWithQcmSchema = storeTestQuestionSchema.extend({
  ...storeQcmSchema.shape,
});

export type StoreTestQuestionWithQcm = z.infer<
  typeof storeTestQuestionWithQcmSchema
>;

export type TestQuestionWithQcm = z.infer<typeof testQuestionWithQcmSchema>;

export type StoreTestQuestion = z.infer<typeof storeTestQuestionSchema>;

export type TestQuestion = z.infer<typeof testQuestionSchema>;
