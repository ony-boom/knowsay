"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import {
  testQuestionSchema,
  testQuestionWithQcmSchema,
} from "@/schemas/testQuestionSchema";

// Schema for array validation
const testQuestionArraySchema = z.array(testQuestionSchema);

/**
 * Get test questions with pagination
 */
export async function getTestQuestions(
  testId: string,
  page = 1,
  pageSize = 10,
  paginate = true,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from("test_questions")
    .select("*", { count: "exact" })
    .eq("test_id", testId)
    .order("position", { ascending: true });

  if (paginate) {
    query = query.range(start, end);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = testQuestionArraySchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data returned from database");
  }

  return {
    questions: validatedData.data,
    totalCount: count || 0,
  };
}

/**
 * Get a single test question by ID
 */
export async function getTestQuestion(id: string) {
  const { data, error } = await supabase
    .from("test_questions")
    .select(
      `
        *,
        qcm:qcm_id (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error?.message);

  return data;
}

/**
 * Get all test questions for a specific test without pagination
 */
export async function getAllTestQuestions(testId: string) {
  try {
    if (!testId) {
      throw new Error("Test ID is required");
    }

    const { data, error } = await supabase
      .from("test_questions")
      .select(
        `
                *,
                qcm:qcm_id (
                    qcm_id,
                    question,
                    created_at,
                    updated_at
                )
            `,
      )
      .eq("test_id", testId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching test questions:", error);
    return [];
  }
}

/**
 * Get all test questions with their QCM details for a specific test
 */
export async function getAllTestQuestionsWithQcm(testId: string) {
  try {
    if (!testId) {
      throw new Error("Test ID is required");
    }

    const { data, error } = await supabase
      .from("test_questions")
      .select(
        `
                *,
                qcm:qcm_id(
                    qcm_id,
                    question,
                    created_at,
                    updated_at,
                    qcm_options:qcm_options(
                        option_id,
                        option_text,
                        option_image_url,
                        is_correct
                    )
                )
            `,
      )
      .eq("test_id", testId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Create array schema for the joined data
    const testQuestionsWithQcmArraySchema = z.array(testQuestionWithQcmSchema);
    const validatedData = testQuestionsWithQcmArraySchema.safeParse(data);

    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching test questions with QCM:", error);
    return [];
  }
}

/**
 * Get a single test question with its QCM details by ID
 */
export async function getTestQuestionWithQcm(id: string) {
  try {
    if (!id) {
      throw new Error("Question ID is required");
    }

    const { data, error } = await supabase
      .from("test_questions")
      .select(
        `
                *,
                qcm:qcm_id(
                    qcm_id,
                    question,
                    created_at,
                    updated_at,
                    qcm_options:qcm_options(
                        option_id,
                        option_text,
                        option_image_url,
                        is_correct
                    )
                )
            `,
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Validate the data against schema
    const validatedData = testQuestionWithQcmSchema.safeParse(data);

    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching test question with QCM:", error);
    throw error;
  }
}
