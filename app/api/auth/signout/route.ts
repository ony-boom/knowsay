import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (session?.user?.supabaseId) {
    // Update online status in Supabase
    await supabase
      .from("users")
      .update({ online: false })
      .eq("id", session.user.supabaseId);
  }

  return NextResponse.json({ status: "success" });
}
