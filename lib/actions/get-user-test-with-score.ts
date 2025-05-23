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

  const withMaybeDuplicate = testWithScore as UserTestWithScore[];

  return Array.from(
    withMaybeDuplicate.reduce((map, test) => {
      if (
        !map.has(test.test_id) ||
        new Date(map.get(test.test_id).completed_at) <
          new Date(test?.completed_at as string)
      ) {
        map.set(test.test_id, test);
      }
      return map;
    }, new Map()),
  ).map(([, test]) => test);
}

export type UserTestWithScore = TestAttempt & {
  tests: Test;
};
