"use server";

import { supabase } from "@/lib/supabase";
import { Test, testSchema } from "@/schemas/testSchema";
import { z } from "zod";

const ITEMS_PER_PAGE = 9;

// Define a schema for tests array
const testArraySchema = z.array(testSchema);

/**
 * Fetches tests with pagination, filtering, and sorting
 * @param query Search query for test titles
 * @param page Current page number (defaults to fetching all tests if undefined)
 * @param includeCompleted Whether to include completed tests (based on end_time)
 * @returns Filtered tests with pagination data
 */
export async function getTests(
  query: string = "",
  page?: number,
  includeCompleted: boolean = true,
) {
  try {
    // Start building the query
    let queryBuilder = supabase.from("tests").select("*", { count: "exact" });

    // Apply title filter if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Filter out completed tests if not including them
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
    console.error("Error fetching tests:", error);
    throw error;
  }
}

/**
 * Fetches a single test by ID
 * @param id Test ID
 * @returns Test object or null if not found
 */
export async function getTestById(id: string): Promise<Test | null> {
  try {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("test_id", id)
      .single();

    if (error) {
      console.error("Error fetching test:", error.message);
      return null;
    }

    // Validate the data against the schema
    const validatedData = testSchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to get test details:", error);
    throw error;
  }
}

/**
 * Fetches all tests created by a specific user
 * @param userId User ID
 * @returns Array of tests created by the user
 */
export async function getTestsByCreator(userId: string) {
  try {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Validate data against schema
    const validatedData = testArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Error fetching creator's tests:", error);
    throw error;
  }
}

/**
 * Fetches all tests assigned to a specific corrector
 * @param correctorId Corrector's user ID
 * @returns Array of tests assigned to the corrector
 */
export async function getTestsByCorrector(correctorId: string) {
  try {
    const { data, error } = await supabase
      .from("test_correctors")
      .select(
        `
                id,
                test_id,
                status,
                tests:test_id (*)
            `,
      )
      .eq("corrector_id", correctorId)
      .eq("status", "accepted");

    if (error) throw new Error(error.message);

    // Extract test data from the joined result
    const tests = data.filter((item) => item.tests).map((item) => item.tests);

    // Validate data against schema
    const validatedData = testArraySchema.parse(tests);

    return validatedData;
  } catch (error) {
    console.error("Error fetching corrector's tests:", error);
    throw error;
  }
}
