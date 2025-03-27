"use server";

import { redirect } from "next/navigation";
import {
  createChallengeQuizzesSchema,
  type CreateChallengeQuizzes,
} from "@/schemas/challengeQuizSchema";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export type ChallengeQuizState = {
  errors?: {
    challenge_id?: string[];
    quizzes?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createChallengeQuizzesAction(
  challengeId: string,
  quizzes: CreateChallengeQuizzes,
): Promise<ChallengeQuizState> {
  // Verify user authentication
  const clerkUser = await currentUser();

  console.log("Clerk user", clerkUser); // Debugging line

  if (!clerkUser) {
    redirect("/auth/login");
  }

  // Add challenge_id to each quiz entry
  const challengeQuizData = quizzes.map((quiz) => ({
    challenge_id: challengeId,
    quiz_id: quiz.quiz_id,
  }));

  // Validate input
  const validatedFields = createChallengeQuizzesSchema.safeParse(quizzes);

  if (!validatedFields.success) {
    return {
      errors: {
        quizzes: ["Invalid quiz data"],
        _form: ["Please check the form for errors"],
      },
      message: "Invalid input. Please check the form for errors.",
      success: false,
    };
  }

  try {
    // Verify user has access to the challenge
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    console.log("User", user); // Debugging line

    console.log("User ID:", user?.id); // Debugging line

    const { data: challenge } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_id", challengeId)
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

    // Insert quiz data
    const { error } = await supabase
      .from("challenge_quizzes")
      .insert(challengeQuizData);

    if (error) {
      console.error("Database error:", error);
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to add quizzes to challenge"],
        },
        success: false,
      };
    }

    return {
      message: "Quizzes successfully added to challenge",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to add quizzes to challenge. Please try again."],
      },
      success: false,
    };
  }
}

export async function deleteChallengeQuizAction(
  id: string,
): Promise<ChallengeQuizState> {
  // Verify user authentication
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/auth/login");
  }

  try {
    // Get user details
    const { data: user } = await supabase
      .from("users")
      .select("user_id")
      .eq("clerk_id", clerkUser.id)
      .single();

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
      .eq("creator_id", user?.user_id)
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
