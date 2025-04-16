"use server";

import { supabase } from "@/lib/supabase";
import { currentUser } from "@/lib/auth-compatibility";

export async function getStatsOverviewData() {
  // Replace Clerk with NextAuth
  const session = await currentUser();
  if (!session?.user) {
    return;
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return;
  }

  return Promise.all([
    supabase.rpc(
      "distinct_quiz_attempts",
      {
        user_uuid: user.id,
      },
      { count: "exact" },
    ),

    supabase.rpc(
      "distinct_test_attempts",
      {
        user_uuid: user.id,
      },
      { count: "exact" },
    ),

    supabase.rpc(
      "get_completed_attempts",
      {
        user_uuid: user.id,
      },
      { count: "exact" },
    ),
  ]);
}
