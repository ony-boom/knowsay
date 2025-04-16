import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Verify webhook with secret header if needed
    // const webhookSecret = req.headers.get('x-webhook-secret');
    // if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    // Process based on event type
    const eventType = payload.type;
    
    if (eventType === 'user.created' || eventType === 'user.updated') {
      // Handle user creation/update events
      const userData = payload.data;
      
      console.info(`Received webhook with ID ${payload.id} and event type of ${eventType}`);

      // Check if user exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", userData.id)
        .single();
        
      if (!existingUser) {
        // Create new user
        await supabase.from("users").insert([{
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          role: "user",
          imageUrl: userData.avatar_url,
        }]);
      } else {
        // Update user
        await supabase
          .from("users")
          .update({
            email: userData.email,
            name: userData.name,
            imageUrl: userData.avatar_url,
          })
          .eq("id", userData.id);
      }
    }
    
    if (eventType === 'user.deleted') {
      // Handle user deletion
      await supabase.from("users").delete().eq("id", payload.data.id);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
