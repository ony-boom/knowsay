"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { State } from "./types";
import { currentUser } from "@clerk/nextjs/server";
import { StoreQuiz, storeQuizSchema } from "@/lib/definitions";

export async function createQuiz(
  quizData: StoreQuiz & {
    creator_id: string;
  },
) {
  return supabase.from("quiz").insert(quizData).select().single();
}

export async function createQuizFormAction(
  _: State,
  data: FormData,
): Promise<State> {
  let quizId: string;

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/auth/login");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  if (!user) {
    redirect("/auth/login");
  }

  quizId = user.id;

  const formData = {
    title: data.get("title") as string,
    description: (data.get("description") as string) || null,
    difficulty: data.get("difficulty") as "EASY" | "MEDIUM" | "HARD",
    category_id: data.get("category_id") as string,
    is_public:
      data.get("is_public") === "on" || data.get("is_public") === "true",
  };

  // Validate input
  const validatedFields = storeQuizSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { error } = await createQuiz({
      ...validatedFields.data,
      creator_id: user.id,
    });

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

  revalidatePath(`/home/quiz/${quizId}/edit`);
  redirect(`/home/quiz/${quizId}/edit`);
}
