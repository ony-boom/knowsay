import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("quizzes").select("*");

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, category, difficulty, created_by } = await req.json();

    const { data, error } = await supabase
      .from("quizzes")
      .insert([{ title, category, difficulty, created_by }]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Quiz created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
