import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quiz_id = searchParams.get("quiz_id");

    if (!quiz_id)
      return Response.json({ error: "quiz_id is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quiz_id);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { quiz_id, type, content } = await req.json();

    const { data, error } = await supabase
      .from("questions")
      .insert([{ quiz_id, type, content }]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Question added successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
