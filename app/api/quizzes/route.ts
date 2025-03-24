import { supabase } from "@/lib/supabase";
import { quizSchema, quizArraySchema } from "@/schemas/quizSchema";

export async function GET() {
  try {
    const { data, error } = await supabase.from("quiz").select("*");

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Validate the data against the schema
    // ✅ Validate and parse the response using Zod
    const validatedData = quizArraySchema.parse(data);

    return Response.json(validatedData, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a submission schema without required fields that DB generates
    const QuizSubmissionSchema = quizSchema.omit({
      quiz_id: true,
      created_at: true,
    });

    // Validate the input
    const result = QuizSubmissionSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: result.error.format() }, { status: 400 });
    }

    const { title, difficulty, creator_id, is_public, description } =
      result.data;

    const { data, error } = await supabase.from("quiz").insert([
      {
        title,
        difficulty,
        creator_id,
        is_public,
        description,
      },
    ]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Quiz created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
