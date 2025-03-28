import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "../supabase";
import { TestAttempt } from "@/schemas/testAttemptSchema";
import { Test } from "@/schemas/testSchema";

export async function getUserTestWithScore() {
  const clerkUser = await currentUser();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser?.id)
    .single();

  if (!user) return [];

  const { data: testWithScore, error } = await supabase
    .from("test_attempts")
    .select("*, tests(*)")
    .eq("user_id", user.id)
    .order("completed_at")
    .limit(4);

  if (error) {
    console.error("Error fetching user test with score:", error);
    return [];
  }

  return testWithScore as UserTestWithScore[];
}

export type UserTestWithScore = TestAttempt & {
  tests: Test;
};
