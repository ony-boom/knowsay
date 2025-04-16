"use server";

import { redirect } from "next/navigation";
import { createChallengeSchema } from "@/schemas/challengeSchema";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@/lib/auth-compatibility";
import type { Challenge } from "@/schemas/challengeSchema";

export type ChallengeState = {
  errors?: {
    title?: string[];
    description?: string[];
    start_time?: string[];
    end_time?: string[];
    is_team_based?: string[];
    _form?: string[];
  };
  message?: string | null;
  challenge?: Challenge;
};

export async function createChallengeAction(
  prevState: ChallengeState,
  data: FormData,
): Promise<ChallengeState> {
  let challengeId;
  // Extract form data
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/auth/login");
  }

  const formData = {
    title: data.get("title") as string,
    description: (data.get("description") as string) || null,
    start_time: data.get("start_time") as string,
    end_time: data.get("end_time") as string,
    is_team_based:
      data.get("is_team_based") === "on" ||
      data.get("is_team_based") === "true",
  };

  // Validate input
  const validatedFields = createChallengeSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check the form for errors.",
    };
  }

  try {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    const { data, error } = await supabase
      .from("challenges")
      .insert({
        creator_id: user?.id,
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        start_time: validatedFields.data.start_time,
        end_time: validatedFields.data.end_time,
        is_team_based: validatedFields.data.is_team_based,
      })
      .select()
      .single();

    if (data) {
      challengeId = data.challenge_id;
    }

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to create challenge"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create challenge. Please try again."],
      },
    };
  }

  redirect(`/home/challenge/${challengeId}/edit`);
}
