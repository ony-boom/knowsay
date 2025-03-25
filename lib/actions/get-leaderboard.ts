import { supabase } from "@/lib/supabase";
import { LeaderBoardEntry } from "@/lib/definitions";

export async function getLeaderboard() {
  const { data } = await supabase.rpc("get_leaderboard");
  return (data ?? []) as LeaderBoardEntry[];
}
