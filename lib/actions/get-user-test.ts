"use server";

import { supabase } from "@/lib/supabase";
import { currentUser } from "../auth-compatibility";
import { redirect } from "next/navigation";
import { z } from "zod";
import { testSchema } from "@/schemas/testSchema";

const ITEMS_PER_PAGE = 9;

// Schema for validated array of tests
const testArraySchema = z.array(testSchema);

/**
 * Fetches tests created by the current authenticated user with pagination, filtering, and sorting.
 *
 * @param query Optional search query for test titles.
 * @param page Optional current page number.
 * @returns An object containing the filtered tests, total pages, and total count.
 */
export async function getUserTests(query: string = "", page?: number) {
  try {
    // Verify the user is authenticated
    const clerkUser = await currentUser();

    if (!clerkUser) {
      redirect("/auth/login");
    }

    // Get the user's internal ID from Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (userError || !user) {
      throw new Error("Unable to find user record");
    }

    // Build query to fetch tests for the current user
    let queryBuilder = supabase
      .from("tests")
      .select("*", { count: "exact" })
      .eq("creator_id", user.id);

    // Filter by title if a search query is provided
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Apply pagination and order by creation date if page is specified
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

    // Validate the data against the schema
    const validatedData = testArraySchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error("Invalid data returned from database");
    }

    return {
      tests: validatedData.data,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
      totalCount: count || 0,
    };
  } catch (error) {
    console.error("Error fetching user tests:", error);
    throw error;
  }
}
