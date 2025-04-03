import { User } from "../definitions";
import { supabase } from "../supabase"

export const getAllParticipants = async () => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select('id, email, name, clerk_id, imageUrl').eq('role', 'user');
        if (error) {
            console.error(`Postgres error: ${error}`)
        }
        return data as User[];
    } catch(e) {
        console.error(`Some error on data fetching caused by: ${e}`)
    }
};
