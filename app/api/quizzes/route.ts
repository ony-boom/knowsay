import { supabase } from "@/lib/supabase";
import {
  QuizSchema,
  QuizArraySchema,
  QuizArraySchemaWithCategory,
} from "@/schemas/quizSchema";

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
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
const ITEMS_PER_PAGE = 9;

/**
 * Fetches quizzes with pagination, filtering, and sorting
 * @param query Search query for quiz titles
 * @param page Current page number (defaults to fetching all quizzes if undefined)
 * @param categorySlug Optional category filter
 * @returns Filtered quizzes with pagination data
 */
export async function fetchQuizzes(
  query: string = "",
  page?: number,
  categorySlug?: string,
) {
  try {
    // Start with a query that joins categories table
    let queryBuilder = supabase
      .from("quizzes")
      .select("*, categories!inner(*)", { count: "exact" });

    // Apply title filter if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Apply category filter if categorySlug is provided
    if (categorySlug) {
      queryBuilder = queryBuilder.eq("categories.slug", categorySlug);
    }

    // Apply pagination if page is specified
    if (page !== undefined) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      queryBuilder = queryBuilder
        .range(start, end)
        .order("created_at", { ascending: false });
    }

    const { data, error, count } = await queryBuilder;


    if (error) throw new Error(error.message);

    // Validate data against schema
    const validatedData = QuizArraySchemaWithCategory.safeParse(data);
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
export async function fetchFilteredQuizzes(
  query: string,
  currentPage: number,
  categorySlug?: string,
) {
  try {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    // Always join with categories table for consistent data structure
    let queryBuilder = supabase
      .from("quizzes")
      .select("*, categories!inner(*)", { count: "exact" });

    // Apply title filter if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Apply category filter if categorySlug is provided
    if (categorySlug) {
      queryBuilder = queryBuilder.eq("categories.slug", categorySlug);
    }

    const { data, error, count } = await queryBuilder
      .range(start, end)
      .order("created_at", { ascending: false });

    console.log("Filtered Data:", data);

    if (error) throw new Error(error.message);

    // Always validate with QuizArraySchemaWithCategory
    const validatedData = QuizArraySchemaWithCategory.safeParse(data);

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
