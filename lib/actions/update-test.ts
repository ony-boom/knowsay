"use server";

import { createTestSchema } from "@/schemas/testSchema";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type TestState = {
  message: string | null;
  errors: {
    [key: string]: string[] | undefined;
    _form?: string[];
  };
};

export async function updateTest(
  testId: string,
  prevState: TestState,
  formData: FormData,
): Promise<TestState> {
  // Extract form data
  const data = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    start_time: (formData.get("start_time") as string) || null,
    end_time: (formData.get("end_time") as string) || null,
  };

  // Validate input
  const validatedFields = createTestSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { error } = await supabase
      .from("tests")
      .update({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        start_time: validatedFields.data.start_time,
        end_time: validatedFields.data.end_time,
        updated_at: new Date().toISOString(),
      })
      .eq("test_id", testId);

    if (error) {
      return {
        message: null,
        errors: {
          _form: ["Database error: Failed to update test"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: null,
      errors: {
        _form: ["Failed to update test. Please try again."],
      },
    };
  }

  revalidatePath(`/home/test/${testId}/edit`);
  return {
    message: "Test updated successfully",
    errors: {},
  };
}
