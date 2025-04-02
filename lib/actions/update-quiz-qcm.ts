"use server";

import { QuizQcmState } from "./types";
import { supabase } from "@/lib/supabase";
import { storeQcmSchema } from "@/schemas/qcmSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateQuizQcm(
  qcmId: string,
  quizQuestionId: string,
  prevState: QuizQcmState,
  formData: FormData,
): Promise<QuizQcmState> {
  // Extract form data for QCM
  let quizId;

  const qcmData = {
    question: (formData.get("question") as string) || "",
  };

  // Validate QCM input using Zod schema
  const validatedQcm = storeQcmSchema.safeParse(qcmData);

  if (!validatedQcm.success) {
    return {
      errors: validatedQcm.error.flatten().fieldErrors,
      message: "Invalid QCM data. Please check the form for errors.",
    };
  }

  try {
    // Update the QCM
    const { error: qcmError } = await supabase
      .from("qcm")
      .update(validatedQcm.data)
      .eq("qcm_id", qcmId);

    if (qcmError) {
      console.error("Failed to update QCM:", qcmError);
      return {
        message: qcmError.message,
        errors: {
          _form: ["Database error: Failed to update QCM"],
        },
      };
    }

    // Get the quiz question to get the quiz_id
    const { data: quizQuestion, error: fetchError } = await supabase
      .from("quiz_questions")
      .select("quiz_id")
      .eq("id", quizQuestionId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch quiz question:", fetchError);
      return {
        message: fetchError.message,
        errors: {
          _form: ["Database error: Failed to fetch quiz question"],
        },
      };
    }

    quizId = quizQuestion.quiz_id;
  } catch (error) {
    console.error("Error updating QCM question:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to update QCM question. Please try again."],
      },
    };
  }

  revalidatePath(`/home/quiz/${quizId}/edit/question/${quizQuestionId}/edit`);
  redirect(`/home/quiz/${quizId}/edit/question/${quizQuestionId}/edit`);
}
