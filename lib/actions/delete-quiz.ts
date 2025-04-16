"use server";

import { currentUser  } from "../auth-compatibility";
import { redirect } from "next/navigation";
import { supabase } from "../supabase";
import { revalidatePath } from "next/cache";

export interface DeleteQuizState {
  errors?: {
    _form?: string[];
  };
  message?: string;
  success: boolean;
}

export async function deleteQuizAction(
  quizId: string,
): Promise<DeleteQuizState> {
  // Verify user authentication
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/auth/login");
  }

  try {
    // Get user details
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (!user) {
      return {
        errors: {
          _form: ["User not found"],
        },
        success: false,
      };
    }

    // Verify quiz exists and user has permission to delete it
    const { data: quiz } = await supabase
      .from("quiz")
      .select("*")
      .eq("quiz_id", quizId)
      .eq("creator_id", user.id)
      .single();

    if (!quiz) {
      return {
        errors: {
          _form: ["Quiz not found or you don't have permission to delete it"],
        },
        success: false,
      };
    }

    // Get all quiz questions associated with this quiz
    const { data: quizQuestions } = await supabase
      .from("quiz_questions")
      .select("qcm_id")
      .eq("quiz_id", quizId);

    if (quizQuestions && quizQuestions.length > 0) {
      // Extract qcm IDs to delete
      const qcmIds = quizQuestions.map((question) => question.qcm_id);

      // Delete qcm_options first (due to foreign key constraints)
      for (const qcmId of qcmIds) {
        const { error: optionsError } = await supabase
          .from("qcm_options")
          .delete()
          .eq("qcm_id", qcmId);

        if (optionsError) {
          return {
            errors: {
              _form: [`Failed to delete QCM options: ${optionsError.message}`],
            },
            success: false,
          };
        }
      }

      // Delete qcm records
      for (const qcmId of qcmIds) {
        const { error: qcmError } = await supabase
          .from("qcm")
          .delete()
          .eq("qcm_id", qcmId);

        if (qcmError) {
          return {
            errors: {
              _form: [`Failed to delete QCM: ${qcmError.message}`],
            },
            success: false,
          };
        }
      }
    }

    // Delete the quiz (this will cascade delete quiz_questions)
    const { error: quizError } = await supabase
      .from("quiz")
      .delete()
      .eq("quiz_id", quizId);

    if (quizError) {
      return {
        errors: {
          _form: [`Failed to delete quiz: ${quizError.message}`],
        },
        success: false,
      };
    }

    // Revalidate relevant paths
    revalidatePath("/home/my-quiz");

    return {
      message: "Quiz and all associated data successfully deleted",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred while deleting the quiz"],
      },
      success: false,
    };
  }
}
