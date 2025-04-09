import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _: NextRequest,
  {
    params,
  }: { params: Promise<{ questionId: string; id: string; attemptId: string }> },
) {
  const { questionId, attemptId } = await params;
  const { data, error } = await supabase
    .from("test_attempt_answers")
    .select(`*`)
    .eq("question_id", questionId)
    .eq("test_attempt_id", attemptId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error(error);
    return Response.json(null, {
      status: 500,
    });
  }

  return Response.json(data, {
    status: 200,
  });
}
