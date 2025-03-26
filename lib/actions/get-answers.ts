"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { qcmOptionSchema } from "@/schemas/qcmOptionSchema";

export async function getAnswers(questionId: string) {
  const { data, error } = await supabase
    .from("qcm_options")
    .select("*")
    .eq("qcm_id", questionId);

  if (error) throw new Error(error.message);
  const validatedData = z.array(qcmOptionSchema).safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);

    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}
