"use server";

import { supabase } from "@/lib/supabase";
import {
  challengeQuizArraySchema,
  challengeQuizSchema,
  challengeQuizWithQuizArraySchema,
} from "@/schemas/challengeQuizSchema";

/**
 * Get a single challenge quiz by ID
 */
export async function getChallengeQuiz(id: string) {
  const { data, error } = await supabase
    .from("challenge_quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = challengeQuizSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}

/**
 * Get a challenge quiz with its associated quiz data
 */
export async function getChallengeQuizWithQuiz(id: string) {
  try {
    if (!id) {
      throw new Error("Challenge quiz ID is required");
    }

    const { data, error } = await supabase
      .from("challenge_quizzes")
      .select(`*, quiz:quiz_id(*)`)
      .eq("challenge_id", id);

    if (error) {
      throw new Error(error.message);
    }

    // Validate the data against schema - use array schema since we're returning an array now
    const validatedData = challengeQuizWithQuizArraySchema.safeParse(data);

    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching challenge quiz with quiz:", error);
    throw error;
  }
}

/**
 * Get all challenge quizzes for a specific challenge
 */
export async function getChallengeQuizzes(challengeId: string) {
  try {
    if (!challengeId) {
      throw new Error("Challenge ID is required");
    }

    const { data, error } = await supabase
      .from("challenge_quizzes")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Validate data against schema
    const validatedData = challengeQuizArraySchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching challenge quizzes:", error);
    return [];
  }
}

/**
 * Get all challenge quizzes with their quiz data for a specific challenge
 */
export async function getChallengeQuizzesWithQuiz(challengeId: string) {
  try {
    if (!challengeId) {
      throw new Error("Challenge ID is required");
    }

    const { data, error } = await supabase
      .from("challenge_quizzes")
      .select(
        `
                *,
                quiz:quiz_id (*)
            `,
      )
      .eq("challenge_id", challengeId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Validate data against schema
    const validatedData = challengeQuizWithQuizArraySchema.safeParse(data);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching challenge quizzes with quiz:", error);
    return [];
  }
}
