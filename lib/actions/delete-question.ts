"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { State } from "./types";

export async function deleteQuestion(
  questionId: string,
  quizId: string,
): Promise<State> {
  if (!questionId) {
    return {
      message: "Question ID is required",
      errors: {
        _form: ["Question ID is required"],
      },
    };
  }

  try {
    // Delete the question from the database
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to delete question"],
        },
      };
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to delete question. Please try again."],
      },
    };
  }

  // After successful deletion, redirect to the quiz edit page
  revalidatePath(`/home/quiz/${quizId}/edit`);
  redirect(`/home/quiz/${quizId}/edit`);
}
