import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { QuizAttempt } from "@/schemas/quizAttemptSchema";

export async function getAllQuizAttempts(quizId: string) {
  // get user from clerk
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      `
        *,
        user:user_id (*)
      `,
    )
    .eq("quiz_id", quizId)
    .eq("user.clerk_id", clerkUser.id)
    .order("started_at", { ascending: false });
  if (error) {
    console.error("Error fetching quiz attempts:", error);
    return null;
  }

  return data as QuizAttempt[];
}
