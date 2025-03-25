"use server";

import { supabase } from "@/lib/supabase";

export async function getCategories() {
  try {
    // Fetch categories from the database
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }

    // Validate the data against the schema
    return data;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}

export async function getCategoriesWithQuizCount() {
  try {
    // Fetch categories with the count of quiz
    const { data, error } = await supabase
      .from("categories")
      .select("*, quizzes_count: quiz(count)");

    if (error) {
      console.error(
        "Error fetching categories with quiz count:",
        error.message,
      );
      return [];
    }

    return data;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}
