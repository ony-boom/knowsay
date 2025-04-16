"use server";

import { supabase } from "../supabase";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function getUser(id: string, isProviderId = false) {
  if (isProviderId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("provider_id", id)
      .single();

    if (error || !data) {
      throw new Error(error?.message || "User not found");
    }
    
    return data;
  }

  const { data: supabaseUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !supabaseUser) {
    console.error(error);
    throw new Error(error?.message || "User not found");
  }

  return supabaseUser;
}

export const getCurrentUserId = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No active session found");
  }

  // Return the Supabase user ID from the session
  if (session.user.supabaseId) {
    return session.user.supabaseId;
  }

  // Fallback to searching by email if supabaseId is not in session
  const { data: supabaseUser, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!supabaseUser || error) {
    throw new Error("User not found");
  }

  return supabaseUser.id;
};

export const getUserInfo = async (id: string | string[]) => {
  if (typeof id === "string") {
    const {data: user, error} = await supabase.from("users").select("name, email, id, imageUrl, online").eq("id", id);
    if (error) {
      console.error("Error fetching user:", error);
      return [];
    }
    return user;
  } else {
    try {
      const { data, error } = await supabase.from("users").select("name, email, id, imageUrl, online").in("id", id);
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
