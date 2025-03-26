"use server";

import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function getStatsOverviewData() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return;
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser?.id)
    .single();

  return Promise.all([
    supabase.rpc(
      "distinct_quiz_attempts",
      {
        user_uuid: user!.id,
      },
      { count: "exact" },
    ),

    supabase.rpc(
      "distinct_test_attempts",
      {
        user_uuid: user!.id,
      },
      { count: "exact" },
    ),

    supabase.rpc(
      "get_completed_attempts",
      {
        user_uuid: user!.id,
      },
      { count: "exact" },
    ),
  ]);
}
