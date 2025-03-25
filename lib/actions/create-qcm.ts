"use server";

import { supabase } from "@/lib/supabase";
import { QcmState } from "./types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { storeQcmSchema } from "@/schemas/qcmSchema";
import {
  StoreQuizQuestion,
  storeQuizQuestionSchema,
} from "@/schemas/quizQuestionSchema";

export async function createQcm(
  quizId: string,
  prevState: QcmState,
  formData: FormData,
): Promise<QcmState> {
  let quizQuestionResult;

  // Extract form data for QCM
  const qcmData = {
    question: (formData.get("question") as string) || "New question",
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
    // First insert the QCM
    const { data: qcmResult, error: qcmError } = await supabase
      .from("qcm")
      .insert(validatedQcm.data)
      .select()
      .single();

    if (qcmError) {
      console.error("Failed to create QCM:", qcmError);
      return {
        message: qcmError.message,
        errors: {
          _form: ["Database error: Failed to create QCM"],
        },
      };
    }

    // Now create the quiz question with the newly created QCM ID
    const quizQuestionWithQcmId: StoreQuizQuestion = {
      quiz_id: quizId,
      qcm_id: qcmResult.qcm_id,
      points: 1,
      time_limit: 30,
    };

    // Validate quiz question data
    const validatedQuizQuestion = storeQuizQuestionSchema.parse(
      quizQuestionWithQcmId,
    );

    if (!validatedQuizQuestion) {
      throw new Error(
        "Invalid quiz question data. Please check the form for errors.",
      );
    }

    // Insert the quiz question
    const { data, error: quizQuestionError } = await supabase
      .from("quiz_questions")
      .insert(validatedQuizQuestion)
      .select()
      .single();

    if (quizQuestionError) {
      console.error("Failed to create quiz question:", quizQuestionError);
      return {
        message: quizQuestionError.message,
        errors: {
          _form: ["Database error: Failed to create quiz question"],
        },
      };
    }

    quizQuestionResult = data;
  } catch (error) {
    console.error("Error creating QCM question:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create QCM question. Please try again."],
      },
    };
  }

  revalidatePath(
    `/home/quiz/${quizId}/edit/question/${quizQuestionResult.id}/edit`,
  );
  redirect(`/home/quiz/${quizId}/edit/question/${quizQuestionResult.id}/edit`);
}
