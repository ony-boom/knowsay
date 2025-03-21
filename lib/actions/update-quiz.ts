"use server";

import {StoreQuizSchema} from "@/schemas/quizSchema";
import {supabase} from "@/lib/supabase";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import { State } from "./types";

export async function updateQuiz(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  // Extract form data
  const data = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    difficulty: formData.get("difficulty") as "EASY" | "MEDIUM" | "HARD",
    category_id: formData.get("category_id") as string,
    is_public:
      formData.get("is_public") === "on" ||
      formData.get("is_public") === "true",
  };

  // Validate input
  const validatedFields = StoreQuizSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { error } = await supabase
      .from("quizzes")
      .update({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        difficulty: validatedFields.data.difficulty,
        is_public: validatedFields.data.is_public,
        category_id: validatedFields.data.category_id,
      })
      .eq("id", id);

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to update quiz"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to update quiz. Please try again."],
      },
    };
  }

  revalidatePath(`/home/quiz/${id}/edit`);
  redirect(`/home/quiz/${id}/edit`);
}
