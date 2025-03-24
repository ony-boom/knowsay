"use server";

import { supabase } from "@/lib/supabase";
import {
  CategoryArraySchema,
  CategoryWithQuizCountArraySchema,
} from "@/schemas/categorySchema";

export async function getCategories() {
  try {
    // Fetch categories from the database
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }

    // Validate the data against the schema
    return CategoryArraySchema.parse(data);
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

    const validatedData = CategoryWithQuizCountArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}
