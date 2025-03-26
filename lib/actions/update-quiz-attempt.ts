"use server";

import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateQuizAttempt(data: {
  quizId: string;
  score: number;
}) {
  const clerkUser = await currentUser();

  if (!clerkUser) return false;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  const { error } = await supabase.from("quiz_attempts").insert({
    quiz_id: data.quizId,
    user_id: user.id,
    status: "completed",
    completed_at: new Date().toISOString(),
    score: data.score,
  });

  revalidatePath(`/home/quiz/${data.quizId}`);
  return !error;
}
