import { supabase } from "@/lib/supabase";
import { LeaderBoardEntry } from "@/lib/definitions";

export async function getLeaderboard() {
  const { data, error } = await supabase.rpc("get_leaderboard");

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as LeaderBoardEntry[];
}
