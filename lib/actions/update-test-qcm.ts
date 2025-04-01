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
  message?: string;
  success?: boolean;
}

export async function updateTestQcm(
  qcmId: string,
  testQuestionId: string,
  prevState: TestQcmState,
  formData: FormData,
): Promise<TestQcmState> {
  let testId;

  try {
    // Extract all form data
    const testQuestionWithQcm = {
      question: formData.get("question") as string,
      is_free_text: formData.get("is_free_text") === "true",
      points: parseInt(formData.get("points") as string) || 1,
      time_limit: parseInt(formData.get("time_limit") as string) || 30,
    };

    // Validate data using the schema
    const validatedData =
      storeTestQuestionWithQcmSchema.safeParse(testQuestionWithQcm);

    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
        message: "Invalid data. Please check the form for errors.",
      };
    }

    // Update the QCM
    const { error: qcmError } = await supabase
      .from("qcm")
      .update({
        question: validatedData.data.question,
      })
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

    // Update the test question
    const { data: testQuestionData, error: testQuestionError } = await supabase
      .from("test_questions")
      .update({
        is_free_text: validatedData.data.is_free_text,
        time_limit: validatedData.data.time_limit,
        points: validatedData.data.points,
      })
      .eq("id", testQuestionId)
      .select("test_id")
      .single();

    if (testQuestionError) {
      console.error("Failed to update test question:", testQuestionError);
      return {
        message: testQuestionError.message,
        errors: {
          _form: ["Database error: Failed to update test question"],
        },
      };
    }

    testId = testQuestionData.test_id;
  } catch (error) {
    console.error("Error updating test QCM question:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to update test QCM question. Please try again."],
      },
    };
  }

  revalidatePath(`/home/test/${testId}/edit/question/${testQuestionId}/edit`);
  redirect(`/home/test/${testId}/edit/question/${testQuestionId}/edit`);
}
