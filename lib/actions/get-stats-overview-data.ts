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
    supabase
      .from("quiz_attempts")
      .select("*", { count: "exact" })
      .eq("user_id", user!.id)
      .eq("status", "completed"),

    supabase
      .from("test_attempts")
      .select("*", { count: "exact" })
      .eq("user_id", user!.id)
      .eq("status", "completed"),

    supabase.rpc(
      "get_completed_attempts",
      {
        user_uuid: user!.id,
      },
      { count: "exact" },
    ),
  ]);
}
