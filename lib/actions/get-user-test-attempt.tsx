import { getCurrentUserId } from "@/lib/actions/get-user";
import { supabase } from "@/lib/supabase";
import { TestAttempt } from "@/schemas/testAttemptSchema";

export async function getUserTestAttempt(testId: string) {
  const userId = await getCurrentUserId();
  const {
    count,
    data: attempts,
    error,
  } = await supabase
    .from("test_attempts")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("test_id", testId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);

    return {
      count: 0,
      attempts: null,
    };
  }

  return {
    count: count ?? 0,
    attempts: (attempts[0] as TestAttempt) ?? null,
  };
}
