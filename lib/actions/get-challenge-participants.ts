"use server";

import { supabase } from "@/lib/supabase";

export type ChallengeParticipant = {
  invitation_id: string;
  email: string;
  user_id?: string;
  name: string;
  role: "participant";
  clerk_id: string;
  status: "active" | "pending";
  joined_at: string | null;
};

/**
 * Fetches all participants for a specific challenge
 * @param challengeId The ID of the challenge
 * @returns Array of participants with their details
 */
export async function getChallengeParticipants(challengeId: string): Promise<{
  participants: ChallengeParticipant[];
  isTeamBased: boolean;
}> {
  try {
    // First check if the challenge exists
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("is_team_based")
      .eq("challenge_id", challengeId)
      .single();

    if (challengeError) {
      throw new Error(`Failed to find challenge: ${challengeError.message}`);
    }

    const isTeamBased = challenge.is_team_based;
    let participants: ChallengeParticipant[] = [];

    // Get participants from challenge invitations
    const { data: invitations, error: invitationsError } = await supabase
      .from("challenge_invitations")
      .select(
        `
                invitation_id,
                email,
                created_at,
                accepted_at,
                is_registered
            `,
      )
      .eq("challenge_id", challengeId);

    if (invitationsError) {
      throw new Error(
        `Failed to fetch invitations: ${invitationsError.message}`,
      );
    }

    // Get user details for registered participants
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select(
        `
                id,
                email,
                name
            `,
      )
      .in(
        "email",
        invitations.map((inv) => inv.email),
      );

    if (usersError) {
      throw new Error(`Failed to fetch user details: ${usersError.message}`);
    }

    // Create a map of email to user details for quick lookup
    const userMap = new Map(users.map((user) => [user.email, user]));

    // Transform invitations into participants
    participants = invitations.map((invitation) => {
      const user = userMap.get(invitation.email);
      const status = invitation.is_registered ? "active" : "pending";

      return {
        invitation_id: invitation.invitation_id,
        email: invitation.email,
        user_id: user?.id,
        name: user?.name || "", // Add missing name property
        role: "participant", // Add default role
        clerk_id: user?.id || "", // Use id as clerk_id or provide empty string
        status: status as "active" | "pending",
        joined_at: invitation.accepted_at || invitation.created_at,
      };
    });

    return {
      participants,
      isTeamBased,
    };
  } catch (error) {
    console.error("Error fetching challenge participants:", error);
    throw error;
  }
}
