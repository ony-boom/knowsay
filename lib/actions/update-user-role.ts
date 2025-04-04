"use server"

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { supabase } from "../supabase"
import { User } from "../definitions";

export const updateUserRole = async (userId: string, newRole: User["role"]) => {
    try  {
        await supabase.from("users").update({
            role: newRole
        }).eq("clerk_id", userId).select("*");
        const clerk = await clerkClient()
        await clerk.users.updateUser(userId, {
            publicMetadata: {
              role: newRole,
            },
          });
        revalidatePath("/");
    } catch(e) {
        console.error('error on update role')
    }
}