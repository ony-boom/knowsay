"use server";

import { currentUser } from "../auth-compatibility";
import { redirect } from "next/navigation";
import { supabase } from "../supabase";
import { revalidatePath } from "next/cache";

export interface DeleteTestState {
  errors?: {
    _form?: string[];
  };
  message?: string;
  success: boolean;
}

export async function deleteTestAction(
  testId: string,
): Promise<DeleteTestState> {
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

    // Verify test exists and user has permission to delete it
    const { data: test } = await supabase
      .from("tests")
      .select("*")
      .eq("test_id", testId)
      .eq("creator_id", user.id)
      .single();

    if (!test) {
      return {
        errors: {
          _form: ["Test not found or you don't have permission to delete it"],
        },
        success: false,
      };
    }

    // Get all test questions associated with this test
    const { data: testQuestions } = await supabase
      .from("test_questions")
      .select("qcm_id")
      .eq("test_id", testId);

    if (testQuestions && testQuestions.length > 0) {
      // Extract qcm IDs to delete
      const qcmIds = testQuestions
        .map((question) => question.qcm_id)
        .filter(Boolean);

      if (qcmIds.length > 0) {
        // Delete qcm_options first (due to foreign key constraints)
        for (const qcmId of qcmIds) {
          const { error: optionsError } = await supabase
            .from("qcm_options")
            .delete()
            .eq("qcm_id", qcmId);

          if (optionsError) {
            return {
              errors: {
                _form: [
                  `Failed to delete QCM options: ${optionsError.message}`,
                ],
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
    }

    // Delete test correctors
    const { error: correctorsError } = await supabase
      .from("test_correctors")
      .delete()
      .eq("test_id", testId);

    if (correctorsError) {
      return {
        errors: {
          _form: [
            `Failed to delete test correctors: ${correctorsError.message}`,
          ],
        },
        success: false,
      };
    }

    // Handle test attempts and their answers
    const { data: testAttempts } = await supabase
      .from("test_attempts")
      .select("id")
      .eq("test_id", testId);

    if (testAttempts && testAttempts.length > 0) {
      const attemptIds = testAttempts.map((attempt) => attempt.id);

      // First delete corrections
      for (const attemptId of attemptIds) {
        const { data: answers } = await supabase
          .from("test_attempt_answers")
          .select("id")
          .eq("test_attempt_id", attemptId);

        if (answers && answers.length > 0) {
          const answerIds = answers.map((answer) => answer.id);

          for (const answerId of answerIds) {
            const { error: correctionError } = await supabase
              .from("answer_corrections")
              .delete()
              .eq("answer_id", answerId);

            if (correctionError) {
              return {
                errors: {
                  _form: [
                    `Failed to delete answer corrections: ${correctionError.message}`,
                  ],
                },
                success: false,
              };
            }
          }
        }

        // Then delete test attempt answers
        const { error: answersError } = await supabase
          .from("test_attempt_answers")
          .delete()
          .eq("test_attempt_id", attemptId);

        if (answersError) {
          return {
            errors: {
              _form: [
                `Failed to delete test attempt answers: ${answersError.message}`,
              ],
            },
            success: false,
          };
        }
      }

      // Finally delete test attempts
      const { error: attemptsError } = await supabase
        .from("test_attempts")
        .delete()
        .eq("test_id", testId);

      if (attemptsError) {
        return {
          errors: {
            _form: [`Failed to delete test attempts: ${attemptsError.message}`],
          },
          success: false,
        };
      }
    }

    // Delete the test (this will cascade delete test_questions due to DB constraints)
    const { error: testError } = await supabase
      .from("tests")
      .delete()
      .eq("test_id", testId);

    if (testError) {
      return {
        errors: {
          _form: [`Failed to delete test: ${testError.message}`],
        },
        success: false,
      };
    }

    // Revalidate relevant paths
    revalidatePath("/home/my-tests");

    return {
      message: "Test and all associated data successfully deleted",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting test:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred while deleting the test"],
      },
      success: false,
    };
  }
}
