"use server";

import { QcmState, State } from "./types";
import { StoreQuestionSchema } from "@/schemas/questionSchema";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateQuestion(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<QcmState> {
  // Extract form data
  const data = {
    quiz_id: formData.get("quiz_id") as string,
    type: formData.get("type") as "QCM" | "OPEN" | "ORDER" | "MATCHING",
    content: formData.get("content") as string,
    timer: Number(formData.get("timer")) || undefined,
  };

  // Validate input
  const validatedFields = StoreQuestionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { error } = await supabase
      .from("questions")
      .update({
        quiz_id: validatedFields.data.quiz_id,
        type: validatedFields.data.type,
        content: validatedFields.data.content,
        timer: validatedFields.data.timer,
      })
      .eq("id", id);

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to update question"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to update question. Please try again."],
      },
    };
  }

  revalidatePath(`/home/quiz/${data.quiz_id}/edit/question/${id}/edit`);
  redirect(`/home/quiz/${data.quiz_id}/edit/question/${id}/edit`);
}
