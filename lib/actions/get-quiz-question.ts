"use server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import {
  quizQuestionSchema,
  quizQuestionWithQcmSchema,
} from "@/schemas/quizQuestionSchema";

// Schema for array validation
const quizQuestionArraySchema = z.array(quizQuestionSchema);

/**
 * Get quiz questions with pagination
 */
export async function getQuizQuestions(
  quizId: string,
  page = 1,
  pageSize = 10,
  paginate = true,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from("quiz_questions")
    .select("*", { count: "exact" })
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });

  if (paginate) {
    query = query.range(start, end);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = quizQuestionArraySchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data returned from database");
  }

  return {
    questions: validatedData.data,
    totalCount: count || 0,
  };
}

/**
 * Get a single quiz question by ID
 */
export async function getQuizQuestion(id: string) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = quizQuestionSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}

/**
 * Get all quiz questions for a specific quiz without pagination
 */
export async function getAllQuizQuestions(quizId: string) {
  try {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const validatedData = quizQuestionArraySchema.parse(data);
    return validatedData;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
}

/**
 * Get all quiz questions with their QCM details for a specific quiz
 */
export async function getAllQuizQuestionsWithQcm(quizId: string) {
  try {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    const { data, error } = await supabase
      .from("quiz_questions")
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
      .eq("quiz_id", quizId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Create array schema for the joined data
    const quizQuestionsWithQcmArraySchema = z.array(quizQuestionWithQcmSchema);
    const validatedData = quizQuestionsWithQcmArraySchema.safeParse(data);

    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching quiz questions with QCM:", error);
    return [];
  }
}
