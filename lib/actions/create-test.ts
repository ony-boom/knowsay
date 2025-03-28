"use server";

import { redirect } from "next/navigation";
import { createTestSchema } from "@/schemas/testSchema";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export type TestState = {
  errors?: {
    title?: string[];
    description?: string[];
    start_time?: string[];
    end_time?: string[];
    _form?: string[];
  };
  message?: string | null;
  test?: import("@/schemas/testSchema").Test;
};

export async function createTestAction(
  prevState: TestState,
  formData: FormData,
): Promise<TestState> {
  let testId;

  // Get the current user
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/auth/login");
  }

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
      message: "Invalid input. Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Get user ID from Clerk user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (!user) {
      return {
        message: "User not found",
        errors: {
          _form: ["Unable to identify user. Please try again."],
        },
      };
    }

    // Insert test into database
    const { data: test, error } = await supabase
      .from("tests")
      .insert({
        creator_id: user.id,
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        start_time: validatedFields.data.start_time,
        end_time: validatedFields.data.end_time,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return {
        message: "Failed to create test",
        errors: {
          _form: ["Database error: " + error.message],
        },
      };
    }

    if (test) {
      testId = test.test_id;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create test. Please try again."],
      },
    };
  }

  // Redirect to test edit page
  redirect(`/home/test/${testId}/edit`);
}
