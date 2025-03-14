import { supabase } from "@/lib/supabase";
import { QuizSchema, QuizArraySchema } from "@/schemas/quizSchema";
import { z } from "zod";

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

    const { title, category, difficulty, created_by, is_public, description } =
      result.data;

    const { data, error } = await supabase.from("quizzes").insert([
      {
        title,
        category,
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
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const ITEMS_PER_PAGE = 9;
// fetch quizzes page, return total pages
export async function fetchQuizzesPage(query: string) {
  try {
    let queryBuilder = supabase.from("quizzes").select("*", { count: "exact" });

    // Apply filter if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw new Error(error.message);

    // Validate data against schema
    const validatedData = QuizArraySchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error("Invalid data returned from database");
    }

    return {
      quizzes: validatedData.data,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
      totalCount: count || 0,
    };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}

// fetch filtered quizzes
export async function fetchFilteredQuizzes(query: string, currentPage: number) {
  try {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    let queryBuilder = supabase.from("quizzes").select("*", { count: "exact" });

    // Apply filter if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    const { data, error, count } = await queryBuilder
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Validate data against schema
    const validatedData = QuizArraySchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error("Invalid data returned from database");
    }

    return {
      quizzes: validatedData.data,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error("Error fetching filtered quizzes:", error);
    throw error;
  }
}
