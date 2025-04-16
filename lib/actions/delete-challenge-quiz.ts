"use server";

import { redirect } from "next/navigation";
import { supabase } from "../supabase";
import { revalidatePath } from "next/cache";
import { ChallengeQuizState } from "./create-challenge-quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function deleteChallengeQuizAction(
  id: string,
): Promise<ChallengeQuizState> {
  // Verify user authentication using NextAuth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  try {
    // Get user details using the email from session
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return {
        errors: {
          _form: ["User not found"],
        },
        success: false,
      };
    }

    // Get challenge quiz details to verify ownership
    const { data: challengeQuiz } = await supabase
      .from("challenge_quizzes")
      .select("challenge_id")
      .eq("id", id)
      .single();

    if (!challengeQuiz) {
      return {
        errors: {
          _form: ["Challenge quiz not found"],
        },
        success: false,
      };
    }

    // Verify user has access to the challenge
    const { data: challenge } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_id", challengeQuiz.challenge_id)
      .eq("creator_id", user?.id)
      .single();

    if (!challenge) {
      return {
        errors: {
          _form: ["You don't have permission to edit this challenge"],
        },
        message: "Permission denied",
        success: false,
      };
    }

    // Delete the challenge quiz
    const { error } = await supabase
      .from("challenge_quizzes")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to remove quiz from challenge"],
        },
        success: false,
      };
    }

    revalidatePath(`/home/challenge/${challengeQuiz.challenge_id}/edit`);

    return {
      message: "Quiz successfully removed from challenge",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to remove quiz from challenge. Please try again."],
      },
      success: false,
    };
  }
}
