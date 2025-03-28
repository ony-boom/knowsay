import { getTestById } from "@/lib/actions/get-test";
import { testSchema } from "@/schemas/testSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const testData = await getTestById(id);

    if (!testData) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const test = testSchema.parse(testData);
    return NextResponse.json(test, { status: 200 });
  } catch (error) {
    console.error("GET test error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
