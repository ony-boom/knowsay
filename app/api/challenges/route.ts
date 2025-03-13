import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .gt("end_date", new Date());

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, start_date, end_date, created_by } = await req.json();

    const { data, error } = await supabase
      .from("challenges")
      .insert([{ title, start_date, end_date, created_by }]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Challenge created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
