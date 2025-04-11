import { getMessagesBetweenUsers } from "@/lib/messages/get-messages";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await getMessagesBetweenUsers(id);
    return Response.json({
      ...data,
      title: data?.name
    }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
