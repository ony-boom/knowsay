import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { Quiz } from "@/schemas/quizSchema";

export async function getQuizzesWithScoresAndStatus() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return [];
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  const { data, error } = await supabase.rpc("get_quizzes_with_user_score", {
    user_uuid: user.id,
  });

  if (error) {
    console.error(error);
    return [];
  }
  return data as QuizzesWithScoreAndStatus[];
}

export type QuizzesWithScoreAndStatus = {
  quiz_id: string;
  title: string;
  description: string;
  status: string;
  score: number;
  difficulty: Quiz["difficulty"];
  attempt_id: string;
};
