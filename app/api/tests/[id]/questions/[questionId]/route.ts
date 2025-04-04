import { getTestQuestion } from "@/lib/actions/get-test-question";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  const { questionId: id } = await params;

  try {
    const questions = await getTestQuestion(id);
    return Response.json(questions);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
