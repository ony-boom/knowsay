"use server";

import { StoreQuizSchema } from "@/schemas/quizSchema";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { State } from "./types";

export async function createQuiz(
  prevState: State,
  data: FormData,
): Promise<State> {
  let id;
  // Extract form data
  const formData = {
    title: data.get("title") as string,
    description: (data.get("description") as string) || null,
    difficulty: data.get("difficulty") as "EASY" | "MEDIUM" | "HARD",
    category_id: data.get("category_id") as string,
    is_public:
      data.get("is_public") === "on" || data.get("is_public") === "true",
  };

  // Validate input
  const validatedFields = StoreQuizSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("quizzes")
      .insert({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        difficulty: validatedFields.data.difficulty,
        is_public: validatedFields.data.is_public,
        category_id: validatedFields.data.category_id,
      })
      .select()
      .single();

    if (data) {
      id = data.id;
    }

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to create quiz"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create quiz. Please try again."],
      },
    };
  }

  revalidatePath(`/home/quiz/${id}/edit`);
  redirect(`/home/quiz/${id}/edit`);
}
