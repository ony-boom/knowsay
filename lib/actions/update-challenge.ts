"use server";

import { createChallengeSchema } from "@/schemas/challengeSchema";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { State } from "./types";
import { redirect } from "next/navigation";

export async function updateChallenge(
  challengeId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  // Extract form data
  const data = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    is_team_based:
      formData.get("is_team_based") === "on" ||
      formData.get("is_team_based") === "true",
  };

  // Validate input
  const validatedFields = createChallengeSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { error } = await supabase
      .from("challenges")
      .update({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        start_time: validatedFields.data.start_time,
        end_time: validatedFields.data.end_time,
        is_team_based: validatedFields.data.is_team_based,
        updated_at: new Date().toISOString(),
      })
      .eq("challenge_id", challengeId);

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to update challenge"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to update challenge. Please try again."],
      },
    };
  }

  revalidatePath(`/home/challenge/${challengeId}/edit`);
  redirect(`/home/challenge/${challengeId}/edit`);
}
