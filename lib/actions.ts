"use server";

import { CreateQuizSchema } from "@/schemas/quizSchema";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {z} from "zod";
import {AnswerSchema} from "@/schemas/answerSchema";

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    difficulty?: string[];
    categoryId?: string[];
    is_public?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function createQuiz(
  prevState: State,
  data: FormData,
): Promise<State> {
  // Extract form data
  const formData = {
    title: data.get("title") as string,
    description: (data.get("description") as string) || null,
    difficulty: data.get("difficulty") as "EASY" | "MEDIUM" | "HARD",
    categoryId: data.get("categoryId") as string,
    is_public:
      data.get("is_public") === "on" || data.get("is_public") === "true",
  };

  // Validate input
  const validatedFields = CreateQuizSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { error } = await supabase
      .from("quizzes")
      .insert({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        difficulty: validatedFields.data.difficulty,
        is_public: validatedFields.data.is_public,
        // Link to the selected category
        category_id: validatedFields.data.categoryId,
      })
      .select()
      .single();

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to create quiz"],
        },
      };
    }

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/quizzes");

    // Redirect to the new quiz's page or back to the quizzes list
    redirect("/quizzes");
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create quiz. Please try again."],
      },
    };
  }
}


export async function getAnswers(questionId: string) {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", questionId);

  if (error) throw new Error(error.message);
  const validatedData = z.array(AnswerSchema).safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);

    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}

