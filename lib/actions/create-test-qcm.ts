"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { storeQcmSchema } from "@/schemas/qcmSchema";
import {
  StoreTestQuestion,
  storeTestQuestionSchema,
} from "@/schemas/testQuestionSchema";

export interface TestQcmState {
  errors?: {
    question?: string[];
    _form?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string;
}

export async function createTestQcm(
  testId: string,
  prevState: TestQcmState,
  formData: FormData,
): Promise<TestQcmState> {
  let testQuestionResult;

  // Extract form data for QCM
  const qcmData = {
    question: (formData.get("question") as string) || "New question",
  };

  // Get is_free_text from form data (defaulting to false if not provided)
  const isFreeText = formData.get("is_free_text") === "true";

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

    // Now create the test question with the newly created QCM ID
    const testQuestionWithQcmId: StoreTestQuestion = {
      test_id: testId,
      qcm_id: qcmResult.qcm_id,
      points: 1,
      time_limit: 30,
      is_free_text: isFreeText, // Use the value from form data
    };

    // Validate test question data
    const validatedTestQuestion = storeTestQuestionSchema.parse(
      testQuestionWithQcmId,
    );

    if (!validatedTestQuestion) {
      throw new Error(
        "Invalid test question data. Please check the form for errors.",
      );
    }

    // Get current max position for ordering
    const { data: positionData, error: positionError } = await supabase
      .from("test_questions")
      .select("position")
      .eq("test_id", testId)
      .order("position", { ascending: false })
      .limit(1);

    if (positionError) {
      console.error("Failed to get position data:", positionError);
      return {
        message: positionError.message,
        errors: {
          _form: ["Database error: Failed to determine question position"],
        },
      };
    }

    // Calculate new position (1 if no questions exist yet)
    const newPosition =
      positionData && positionData.length > 0
        ? positionData[0].position + 1
        : 1;

    // Insert the test question with position
    const { data, error: testQuestionError } = await supabase
      .from("test_questions")
      .insert({ ...validatedTestQuestion, position: newPosition })
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
