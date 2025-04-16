"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateQuizAttempt(data: {
  quizId: string;
  score: number;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) return false;

  // Get user from Supabase by email or provider ID
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (!user) return false;

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
