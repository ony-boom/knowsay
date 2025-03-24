import { z } from "zod";

export const qcmOptionSchema = z
  .object({
    option_id: z.string().uuid(),
    qcm_id: z.string().uuid(),
    option_text: z.string().nullable(),
    option_image_url: z.string().nullable(),
    is_correct: z.boolean(),
  })
  .refine(
    (data) => data.option_text !== null || data.option_image_url !== null,
    {
      message: "Either option_text or option_image_url must be provided",
    },
  );

export type QCMOption = z.infer<typeof qcmOptionSchema>;
