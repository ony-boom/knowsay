"use server"

import { revalidatePath } from "next/cache";
import { supabase } from "../supabase"
import { User } from "../definitions";

export const updateUserRole = async (userId: string, newRole: User["role"]) => {
    try  {
        // Update role in Supabase
        await supabase.from("users").update({
            role: newRole
        }).eq("provider_id", userId).select("*");
        
        // No need to use Clerk client anymore
        revalidatePath("/");
    } catch(e) {
        console.error(`error on update role: ${e}`)
    }
}