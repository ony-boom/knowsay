"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { supabase } from "../supabase";

export async function getUser(id: string, isClerkId = false) {
  const client = await clerkClient();

  if (isClerkId) {
    return client.users.getUser(id);
  }

  const { data: supabaseUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !supabaseUser) {
    console.error(error);
    throw new Error(error?.message);
  }

  return client.users.getUser(supabaseUser.clerk_id);
}

export const getCurrentUserId = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("No active session found");
  }

  const { data: supabaseUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  if (!supabaseUser || error) {
    throw new Error("User not found");
  }

  return supabaseUser.id;
};
