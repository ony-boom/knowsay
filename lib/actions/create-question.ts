"use server";

import { StoreQuestionSchema } from "@/schemas/questionSchema";
import { supabase } from "@/lib/supabase";
import { QuestionState } from "./types";

export async function createQuestion(
  quizId: string,
  prevState: QuestionState,
  formData: FormData,
): Promise<QuestionState> {
  // Extract form data
  const questionData = {
    quiz_id: quizId,
    content: (formData.get("content") as string) || "New question",
    type:
      (formData.get("type") as "QCM" | "OPEN" | "ORDER" | "MATCHING") || "QCM",
  };

  // Validate input using Zod schema
  const validatedFields = StoreQuestionSchema.safeParse(questionData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    // Insert the question into the database
    const { data, error } = await supabase
      .from("questions")
      .insert({
        quiz_id: validatedFields.data.quiz_id,
        content: validatedFields.data.content,
        type: validatedFields.data.type,
        timer: validatedFields.data.timer ?? 30,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create question:", error);
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to create question"],
        },
      };
    }

    // Return the created question ID for further operations
    return {
      message: "Question created successfully",
      questionId: data.id,
      success: true,
    };
  } catch (error) {
    console.error("Error creating question:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create question. Please try again."],
      },
    };
  }
}
