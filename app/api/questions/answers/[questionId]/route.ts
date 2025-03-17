import { z } from "zod";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { AnswerSchema } from "@/schemas/answerSchema";

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

  return Response.json(validatedData.data);
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  },
) {
  const { questionId } = await params;
  try {
    return await getAnswers(questionId);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
