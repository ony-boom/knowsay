import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // Ensure this is a protected endpoint - add authentication as needed
    const { users } = await req.json();
    
    if (!Array.isArray(users)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    const results = [];
    
    for (const user of users) {
      // Check if a user with this clerk_id already exists
      const { data: existingUserByClerkId } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();
        
      if (existingUserByClerkId) {
        // Update the existing user with provider information
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            provider: "clerk_migrated",
            provider_id: user.id,
            online: false
          })
          .eq("clerk_id", user.id)
          .select()
          .single();
          
        if (updateError) {
          results.push({ 
            id: user.id,
            status: "error", 
            message: updateError.message 
          });
        } else {
          results.push({ 
            id: user.id, 
            status: "updated", 
            user: updatedUser 
          });
        }
        
        continue;
      }
      
      // Check if a user with this email already exists
      if (user.email) {
        const { data: existingUserByEmail } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (existingUserByEmail) {
          // Update the existing user with clerk_id
          const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update({
              clerk_id: user.id,
              provider: "clerk_migrated",
              provider_id: user.id
            })
            .eq("email", user.email)
            .select()
            .single();
            
          if (updateError) {
            results.push({ 
              id: user.id,
              status: "error", 
              message: updateError.message 
            });
          } else {
            results.push({ 
              id: user.id, 
              status: "linked", 
              user: updatedUser 
            });
          }
          
          continue;
        }
      }
      
      // Create a new user if they don't exist
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([{
          clerk_id: user.id,
          email: user.email || `user-${user.id}@example.com`,
          name: user.name || `User ${user.id.substring(0, 6)}`,
          role: "user",
          imageUrl: user.imageUrl,
          provider: "clerk_migrated",
          provider_id: user.id,
        }])
        .select()
        .single();
        
      if (createError) {
        results.push({ 
          id: user.id,
          status: "error", 
          message: createError.message 
        });
      } else {
        results.push({ 
          id: user.id, 
          status: "created", 
          user: newUser 
        });
      }
    }
    
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error processing user migration:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
