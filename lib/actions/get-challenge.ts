"use server";

import { supabase } from "@/lib/supabase";
import { Challenge, challengeSchema } from "@/schemas/challengeSchema";
import { z } from "zod";

const ITEMS_PER_PAGE = 9;

// Define a schema for challenges array
const challengeArraySchema = z.array(challengeSchema);

/**
 * Fetches challenges with pagination, filtering, and sorting
 * @param query Search query for challenge titles
 * @param page Current page number (defaults to fetching all challenges if undefined)
 * @param includeCompleted Whether to include completed challenges (based on end_time)
 * @returns Filtered challenges with pagination data
 */
export async function getChallenges(
  query: string = "",
  page?: number,
  includeCompleted: boolean = true,
) {
  try {
    // Start building the query
    let queryBuilder = supabase
      .from("challenges")
      .select("*", { count: "exact" });

    // Apply title filter if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Filter out completed challenges if not including them
    if (!includeCompleted) {
      const now = new Date().toISOString();
      queryBuilder = queryBuilder.gt("end_time", now);
    }

    // Apply pagination if page is specified
    if (page !== undefined) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      queryBuilder = queryBuilder
        .range(start, end)
        .order("start_time", { ascending: true });
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw new Error(error.message);

    // Validate data against schema
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
    console.error("Error fetching challenges:", error);
    throw error;
  }
}

/**
 * Fetches a single challenge by ID
 * @param id Challenge ID
 * @returns Challenge object or null if not found
 */
export async function getChallengeById(id: string): Promise<Challenge | null> {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_id", id)
      .single();

    if (error) {
      console.error("Error fetching challenge:", error.message);
      return null;
    }

    // Validate the data against the schema
    const validatedData = challengeSchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to get challenge details:", error);
    throw error;
  }
}

/**
 * Fetches all challenges created by a specific user
 * @param userId User ID
 * @returns Array of challenges created by the user
 */
export async function getChallengesByCreator(userId: string) {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Validate data against schema
    const validatedData = challengeArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Error fetching creator's challenges:", error);
    throw error;
  }
}
