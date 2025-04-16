import { supabase } from "../supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getUserCompletedChallenges() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return [];
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return [];
  }

  const { data: completedChallenges } = await supabase.rpc(
    "get_user_completed_challenges",
    {
      user_uuid: user.id,
    },
  );

  return completedChallenges;
}
