import { getChallengeById } from "@/lib/actions/get-challenge";
import { challengeSchema } from "@/schemas/challengeSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const challengeData = await getChallengeById(id);
    const challenge = challengeSchema.parse(challengeData);
    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error("GET challenge error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
