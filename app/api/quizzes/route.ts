import { supabase } from "@/lib/supabase";
import { QuizSchema, QuizArraySchema } from "@/schemas/quizSchema";

export async function GET() {
  try {
    const { data, error } = await supabase.from("quizzes").select("*");

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Validate the data against the schema
    // ✅ Validate and parse the response using Zod
    const validatedData = QuizArraySchema.parse(data);

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
    const QuizSubmissionSchema = QuizSchema.omit({
      id: true,
      created_at: true,
    });

    // Validate the input
    const result = QuizSubmissionSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: result.error.format() }, { status: 400 });
    }

    const { title, difficulty, created_by, is_public, description } =
      result.data;

    const { data, error } = await supabase.from("quizzes").insert([
      {
        title,
        difficulty,
        created_by,
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
