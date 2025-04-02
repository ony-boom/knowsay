"use server";

import { supabase } from "@/lib/supabase";
import { storeTestQuestionWithQcmSchema } from "@/schemas/testQuestionSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface TestQcmState {
  errors?: {
    question?: string[];
    _form?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string | null;
  success?: boolean;
}

export async function createTestQcm(
  testId: string,
  prevState: TestQcmState,
  formData: FormData,
): Promise<TestQcmState> {
  let testQuestionResult;

  try {
    // Extract all form data for combined test question with QCM
    const testQuestionWithQcm = {
      test_id: testId,
      question: formData.get("question") as string,
      is_free_text: formData.get("is_free_text") === "true",
      points: parseInt(formData.get("points") as string) || 1,
      time_limit: parseInt(formData.get("time_limit") as string) || 30,
    };

    // Validate combined data using the schema that includes both test question and QCM fields
    const validatedData =
      storeTestQuestionWithQcmSchema.safeParse(testQuestionWithQcm);

    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
        message: "Invalid data. Please check the form for errors.",
      };
    }

    // First insert the QCM
    const { data: qcmResult, error: qcmError } = await supabase
      .from("qcm")
      .insert({
        question: validatedData.data.question,
      })
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

    // Insert the test question with the new QCM ID
    // Position is now handled by a database trigger
    const { data, error: testQuestionError } = await supabase
      .from("test_questions")
      .insert({
        test_id: validatedData.data.test_id,
        qcm_id: qcmResult.qcm_id,
        is_free_text: validatedData.data.is_free_text,
        time_limit: validatedData.data.time_limit,
        points: validatedData.data.points,
      })
      .select()
      .single();

    if (testQuestionError) {
      console.error("Failed to create test question:", testQuestionError);
      return {
        message: testQuestionError.message,
        errors: {
          _form: ["Database error: Failed to create test question"],
        },
      };
    }

    testQuestionResult = data;
  } catch (error) {
    console.error("Error creating test QCM question:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create test QCM question. Please try again."],
      },
    };
  }

  revalidatePath(
    `/home/test/${testId}/edit/question/${testQuestionResult.id}/edit`,
  );
  redirect(`/home/test/${testId}/edit/question/${testQuestionResult.id}/edit`);
}
