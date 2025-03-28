"use server";
import { supabase } from "@/lib/supabase";
import { quizArraySchemaWithCategory } from "@/schemas/quizSchema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 9;

/**
 * Fetches quizzes created by a specific user with pagination, filtering, and sorting.
 *
 * @param userId The UUID of the user whose quizzes to fetch.
 * @param query Optional search query for quiz titles.
 * @param page Optional current page number.
 * @param categorySlug Optional category filter slug.
 * @returns An object containing the filtered quizzes, total pages, and total count.
 */
export async function getUserQuizzes(
  query: string = "",
  page?: number,
  categorySlug?: string,
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      redirect("/auth/login");
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (userError || !user) {
      throw new Error("Unable to find user record");
    }

    // Build query: fetch quizzes along with their category details, count total items.
    let queryBuilder = supabase
      .from("quiz")
      .select("*, categories!inner(*)", { count: "exact" })
      .eq("creator_id", user.id);

    // Filter by title if a search query is provided.
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Filter by category if a category slug is provided.
    if (categorySlug) {
      queryBuilder = queryBuilder.eq("categories.slug", categorySlug);
    }

    // Apply pagination and order by creation date if page is specified.
    if (page !== undefined) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      queryBuilder = queryBuilder
        .range(start, end)
        .order("created_at", { ascending: false });
    }

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new Error(error.message);
    }

    // Validate the data against the schema.
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
    console.error("Error fetching user quizzes:", error);
    throw error;
  }
}
