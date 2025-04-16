"use server";

import { redirect } from "next/navigation";
import { supabase } from "../supabase";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export interface DeleteChallengeState {
  errors?: {
    _form?: string[];
  };
  message?: string;
  success: boolean;
}

export async function deleteChallengeAction(
  challengeId: string,
): Promise<DeleteChallengeState> {
  // Verify user authentication using NextAuth instead of Clerk
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  try {
    // Get user details
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

    // Verify challenge exists and user has permission to delete it
    const { data: challenge } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_id", challengeId)
      .eq("creator_id", user.id)
      .single();

    if (!challenge) {
      return {
        errors: {
          _form: [
            "Challenge not found or you don't have permission to delete it",
          ],
        },
        success: false,
      };
    }

    // Get all challenge_quiz entries for this challenge
    const { data: challengeQuizzes } = await supabase
      .from("challenge_quiz")
      .select("*")
      .eq("challenge_id", challengeId);

    // Delete challenge_quiz entries
    if (challengeQuizzes && challengeQuizzes.length > 0) {
      const { error: challengeQuizzesError } = await supabase
        .from("challenge_quiz")
        .delete()
        .eq("challenge_id", challengeId);

      if (challengeQuizzesError) {
        return {
          errors: {
            _form: [
              `Failed to delete challenge quizzes: ${challengeQuizzesError.message}`,
            ],
          },
          success: false,
        };
      }
    }

    // Delete team members and teams (if it's a team-based challenge)
    if (challenge.is_team_based) {
      // Get all teams for this challenge
      const { data: teams } = await supabase
        .from("teams")
        .select("team_id")
        .eq("challenge_id", challengeId);

      if (teams && teams.length > 0) {
        const teamIds = teams.map((team) => team.team_id);

        // Delete team members first
        for (const teamId of teamIds) {
          const { error: teamMembersError } = await supabase
            .from("team_members")
            .delete()
            .eq("team_id", teamId);

          if (teamMembersError) {
            return {
              errors: {
                _form: [
                  `Failed to delete team members: ${teamMembersError.message}`,
                ],
              },
              success: false,
            };
          }
        }

        // Delete teams
        const { error: teamsError } = await supabase
          .from("teams")
          .delete()
          .eq("challenge_id", challengeId);

        if (teamsError) {
          return {
            errors: {
              _form: [`Failed to delete teams: ${teamsError.message}`],
            },
            success: false,
          };
        }
      }
    }

    // Delete challenge invitations
    const { error: invitationsError } = await supabase
      .from("challenge_invitations")
      .delete()
      .eq("challenge_id", challengeId);

    if (invitationsError) {
      return {
        errors: {
          _form: [
            `Failed to delete challenge invitations: ${invitationsError.message}`,
          ],
        },
        success: false,
      };
    }

    // Update quiz_attempts related to this challenge
    const { error: attemptsError } = await supabase
      .from("quiz_attempts")
      .update({ challenge_id: null })
      .eq("challenge_id", challengeId);

    if (attemptsError) {
      return {
        errors: {
          _form: [`Failed to update quiz attempts: ${attemptsError.message}`],
        },
        success: false,
      };
    }

    // Delete the challenge
    const { error: challengeError } = await supabase
      .from("challenges")
      .delete()
      .eq("challenge_id", challengeId);

    if (challengeError) {
      return {
        errors: {
          _form: [`Failed to delete challenge: ${challengeError.message}`],
        },
        success: false,
      };
    }

    // Revalidate relevant paths
    revalidatePath("/home/my-challenges");

    return {
      message: "Challenge and all associated data successfully deleted",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return {
      errors: {
        _form: ["An unexpected error occurred while deleting the challenge"],
      },
      success: false,
    };
  }
}
