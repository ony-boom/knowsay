"use server";

import { supabase } from "@/lib/supabase";
import { quizArraySchemaWithCategory, quizSchema } from "@/schemas/quizSchema";

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
      .from("quiz")
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
    const validatedData = quizArraySchemaWithCategory.safeParse(data);
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

export async function getQuizById(id: string) {
  try {
    // Fetch quiz status from the database
    const { data, error } = await supabase
      .from("quiz")
      .select("*")
      .eq("quiz_id", id)
      .single();

    if (error) {
      console.error("Error fetching quiz status:", error.message);
      return null;
    }

    // Validate the data against the schema
    const validatedData = quizSchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to get quiz details:", error);
    throw error;
  }
}
