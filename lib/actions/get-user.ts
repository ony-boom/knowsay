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

export const getUserInfo = async (id: string | string[]) => {
  if (typeof id === "string") {
    const {data: user, error} = await supabase.from("users").select("name, email, id, imageUrl").eq("id", id);
    if (error) {
      console.error("Error fetching user:", error);
      return [];
    }
    return user;
  } else {
    try {
      const { data, error } = await supabase.from("users").select("name, email, id, imageUrl").in("id", id);
      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
}
