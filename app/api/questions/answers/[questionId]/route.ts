import { NextRequest } from "next/server";
import {getAnswers} from "@/lib/actions";

export async function GET(
  _: NextRequest,
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
    const data = await getAnswers(questionId);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
