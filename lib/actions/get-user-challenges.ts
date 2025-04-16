"use server";

import { supabase } from "@/lib/supabase";
import { challengeSchema } from "@/schemas/challengeSchema";
import { currentUser } from "../auth-compatibility";
import { redirect } from "next/navigation";
import { z } from "zod";

const ITEMS_PER_PAGE = 9;

// Define schema for array of challenges with validation
const challengeArraySchema = z.array(challengeSchema);

/**
 * Fetches challenges created by the current user with pagination and filtering.
 *
 * @param query Optional search query for challenge titles.
 * @param page Optional current page number.
 * @param includeCompleted Optional flag to include completed challenges.
 * @returns An object containing the filtered challenges, total pages, and total count.
 */
export async function getUserChallenges(
  query: string = "",
  page?: number,
  includeCompleted: boolean = true,
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

    // Build query: fetch challenges
    let queryBuilder = supabase
      .from("challenges")
      .select("*", { count: "exact" })
      .eq("creator_id", user.id);

    // Filter by title if a search query is provided
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Filter out completed challenges if not requested
    if (!includeCompleted) {
      const now = new Date().toISOString();
      queryBuilder = queryBuilder.gt("end_time", now);
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
    const validatedData = challengeArraySchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error("Invalid data returned from database");
    }

    return {
      challenges: validatedData.data,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
      totalCount: count || 0,
    };
  } catch (error) {
    console.error("Error fetching user challenges:", error);
    throw error;
  }
}
