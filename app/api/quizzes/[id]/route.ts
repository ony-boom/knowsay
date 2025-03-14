import { supabase } from "@/lib/supabase";
import { QuizSchema } from "@/schemas/quizSchema";
import { NextRequest } from "next/server";

export async function getQuiz(id: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw Error("Quiz not found");

  return QuizSchema.parse(data);
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await getQuiz(id);
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
