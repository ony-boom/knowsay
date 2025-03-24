"use server";

import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const getCompletedQuiz = async () => {
  const user = await currentUser();

  if(!user) redirect('/auth/login');
  const { count } = await supabase
    .from("results")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  return count;
};

const getCompletedTest = async () => {
  // TODO: implement
  return 0;
};
const getCompletedChallenge = async () => {
  // TODO: implement
  return 0;
};

export function getStatsOverview() {
  try {
    return Promise.all([
      getCompletedQuiz(),
      getCompletedTest(),
      getCompletedChallenge(),
    ]);
  } catch (error) {
    console.error(error);
    return [];
  }
}
