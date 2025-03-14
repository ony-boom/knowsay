import { supabase } from "@/lib/supabase";
import { AnswerSchema } from "@/schemas/answerSchema";
import { z } from "zod";

export async function getAnswers(questionId: string) {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", questionId);

  if (error) throw new Error(error.message);
  const validatedData = z.array(AnswerSchema).safeParse(data);
  if (!validatedData.success) {
    console.log(validatedData.error);

    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}
