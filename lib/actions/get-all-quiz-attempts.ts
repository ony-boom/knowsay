import { supabase } from "@/lib/supabase";
import { QuizAttempt } from "@/schemas/quizAttemptSchema";
import { currentUser } from "@/lib/auth-compatibility";

export async function getAllQuizAttempts(quizId: string) {
  // Use compatibility layer
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  // Find user by any ID (clerk_id, provider_id, or id)
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .or(`clerk_id.eq.${clerkUser.id},provider_id.eq.${clerkUser.id},email.eq.${clerkUser.emailAddresses[0].emailAddress}`)
    .single();

  if (!user) {
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
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching quiz attempts:", error);
    return null;
  }

  return data as QuizAttempt[];
}

export async function getQuizAttemptById(attemptId: string) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      `
        *,
        user:user_id (*)
      `,
    )
    .eq("id", attemptId)
    .single();
    
  if (error) {
    console.error("Error fetching quiz attempt:", error);
    return null;
  }

  return data as QuizAttempt;
}
