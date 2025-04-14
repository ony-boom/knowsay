"use server";
import { User } from "../definitions";
import { supabase } from "../supabase";

export const getAllParticipants = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, clerk_id, imageUrl")
      .eq("role", "user");
    if (error) {
      console.error(`Postgres error: ${error}`);
    }
    return data as User[];
  } catch (e) {
    console.error(`Some error on data fetching caused by: ${e}`);
  }
};

export const getAllUsers = async (term?: string) => {
  const query = supabase
    .from("users")
    .select("id, email, clerk_id, imageUrl, name, role");
    if (term) {
      query.ilike("name", `%${term}%`);
    }
  try {
    const { data: allUsers, error } = await query;
    if (error) console.error(`Postgres error : ${error}`);
    return allUsers as User[];
  } catch (e) {
    console.error(`Some error occured when fetching user list: ${e}`);
  }
};

export const getAllCorrectors = async () => {
  const { data: allUsers, error } = await supabase
    .from("users")
    .select("id, email, clerk_id, imageUrl, name, role")
    .eq("role", "corrector");
  if (error) console.error(`Postgres error : ${error}`);
  return allUsers as User[];
};

export async function searchUsers(term: string) {
  'use server'
  
  if (!term || term.length < 2) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${term}%,email.ilike.%${term}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data.map((user) => ({
      id: user.id,
      clerk_id: user.clerk_id,
      name: user.name || 'Unnamed',
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
      online: user.online,
    }));
  } catch (error) {
    console.error('Error in searchUsers:', error);
    return [];
  }
}
