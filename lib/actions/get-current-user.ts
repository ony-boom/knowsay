import { supabase } from "@/lib/supabase";
import { currentUser } from "@/lib/auth-compatibility";

export async function getCurrentUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("No active session found");
  }

  const { data: supabaseUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (error || !supabaseUser) {
    throw new Error("User not found");
  }

  return supabaseUser;
}