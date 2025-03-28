import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "../supabase";

export async function getUserCompletedChallenges() {
  const clerkUser = await currentUser();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser?.id)
    .single();

  const { data: completedChallenges } = await supabase.rpc(
    "get_user_completed_challenges",
    {
      user_uuid: user!.id,
    },
  );

  return completedChallenges;
}
