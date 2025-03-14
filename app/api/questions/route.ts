import { supabase } from "@/lib/supabase";
import { QuestionSchema } from "@/schemas/questionSchema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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

    // Validate the data against the schema
    const validatedQuestions = z.array(QuestionSchema).safeParse(data);
    if (!validatedQuestions.success) {
      return Response.json({ error: "Invalid data format" }, { status: 500 });
    }

    return Response.json(validatedQuestions.data, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a submission schema without required fields that DB generates
    const QuestionSubmissionSchema = QuestionSchema.omit({
      id: true,
      created_at: true,
    });

    // Validate the input
    const result = QuestionSubmissionSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: result.error.format() }, { status: 400 });
    }

    const questionData = {
      ...result.data,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("questions")
      .insert([questionData]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Question added successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function getQuestions(quizId: string, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from("questions")
    .select("*", { count: "exact" })
    .eq("quiz_id", quizId)
    .range(start, end)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = z.array(QuestionSchema).safeParse(data);
  if (!validatedData.success) {
    console.log(validatedData.error);

    throw new Error("Invalid data returned from database");
  }

  return {
    questions: validatedData.data,
    totalCount: count || 0,
  };
}

export async function getQuestion(id: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = QuestionSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}
