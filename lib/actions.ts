"use server";

import {
  CreateQuizSchema,
  QuizArraySchemaWithCategory,
} from "@/schemas/quizSchema";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { QuestionSchema } from "@/schemas/questionSchema";
import {
  CategoryArraySchema,
  CategoryWithQuizCountArraySchema,
} from "@/schemas/categorySchema";
import { z } from "zod";
import { AnswerSchema } from "@/schemas/answerSchema";

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    difficulty?: string[];
    categoryId?: string[];
    is_public?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function createQuiz(
  prevState: State,
  data: FormData,
): Promise<State> {
  // Extract form data
  const formData = {
    title: data.get("title") as string,
    description: (data.get("description") as string) || null,
    difficulty: data.get("difficulty") as "EASY" | "MEDIUM" | "HARD",
    categoryId: data.get("categoryId") as string,
    is_public:
      data.get("is_public") === "on" || data.get("is_public") === "true",
  };

  // Validate input
  const validatedFields = CreateQuizSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { error } = await supabase
      .from("quizzes")
      .insert({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        difficulty: validatedFields.data.difficulty,
        is_public: validatedFields.data.is_public,
        // Link to the selected category
        category_id: validatedFields.data.categoryId,
      })
      .select()
      .single();

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to create quiz"],
        },
      };
    }

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/home/quiz/create");

    // Redirect to the new quiz's page or back to the quizzes list
    redirect("/home/quiz/create");
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create quiz. Please try again."],
      },
    };
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

export async function getQuestions(
  quizId: string,
  page = 1,
  pageSize = 10,
  paginate = true,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false });

  if (paginate) {
    query = query.range(start, end);
  }

  const { data, error, count } = await query;

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

export async function getCategories() {
  try {
    // Fetch categories from the database
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }

    // Validate the data against the schema
    const validatedData = CategoryArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}

export async function getCategoriesWithQuizCount() {
  try {
    // Fetch categories with the count of quizzes
    const { data, error } = await supabase
      .from("categories")
      .select("*, quizzes_count: quizzes(count)");

    if (error) {
      console.error(
        "Error fetching categories with quiz count:",
        error.message,
      );
      return [];
    }

    const validatedData = CategoryWithQuizCountArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}

export async function getAnswers(questionId: string) {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", questionId);

  if (error) throw new Error(error.message);
  const validatedData = z.array(AnswerSchema).safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);

    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}

export async function getQuizStatus(id: string) {
  try {
    // Fetch quiz status from the database
    const { data, error } = await supabase
      .from("quizzes")
      .select("status")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching quiz status:", error.message);
      return null;
    }

    // Validate the data against the schema
    const validatedData = CategoryArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}

export async function getQuiz(id: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw Error("Quiz not found");

  return QuizSchema.parse(data);
}
