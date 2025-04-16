/**
 * Compatibility layer between Clerk and NextAuth
 * 
 * This file provides functions that mimic Clerk's API but use NextAuth + Supabase under the hood
 * to make the migration process smoother and prevent breaking changes
 */
import { supabase } from "./supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { Session } from "next-auth";

/**
 * Mimics Clerk's currentUser() function
 */
export async function currentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }
  
  // Get more detailed user info from Supabase
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();
  
  if (!userData) {
    return null;
  }
  
  // Format the data to match Clerk's user structure
  return {
    id: userData.clerk_id || userData.provider_id || userData.id,
    firstName: session.user.name?.split(' ')[0] || null,
    lastName: session.user.name?.split(' ').slice(1).join(' ') || null,
    username: null,
    fullName: session.user.name || null,
    emailAddresses: [{ 
      emailAddress: session.user.email,
      id: "email_" + userData.id,
      verification: { status: "verified" }
    }],
    primaryEmailAddress: { 
      emailAddress: session.user.email,
      id: "email_" + userData.id,
      verification: { status: "verified" }
    },
    imageUrl: session.user.image || userData.imageUrl || null,
    publicMetadata: {
      role: userData.role || 'user'
    },
    privateMetadata: {},
    unsafeMetadata: {}
  };
}

/**
 * Mimics Clerk's getAuth() function
 */
export async function getAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { userId: null, sessionId: null, session: null };
  }
  
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();
    
  return {
    userId: userData?.clerk_id || userData?.provider_id || userData?.id || session.user.id,
    sessionId: session.user.id,
    session: {
      user: {
        id: userData?.clerk_id || userData?.provider_id || userData?.id || session.user.id
      }
    }
  };
}

/**
 * Mimics Clerk's clerkClient() function
 */
export async function clerkClient() {
  // Return an object that mimics the Clerk client API
  return {
    users: {
      getUserList: async () => {
        const { data } = await supabase
          .from("users")
          .select("*");
        
        return (data || []).map(formatUserForClerk);
      },
      getUser: async (userId: string) => {
        // Try to find by clerk_id first
        let { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", userId)
          .single();
          
        if (!userData) {
          // Then try by provider_id
          userData = (await supabase
            .from("users")
            .select("*")
            .eq("provider_id", userId)
            .single()).data;
        }
        
        if (!userData) {
          // Finally try by id
          userData = (await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single()).data;
        }
        
        if (!userData) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        return formatUserForClerk(userData);
      },
      updateUser: async (userId: string, data: any) => {
        // First find the user
        const userQuery = await supabase
          .from("users")
          .select("*")
          .or(`clerk_id.eq.${userId},provider_id.eq.${userId},id.eq.${userId}`)
          .single();
          
        if (!userQuery.data) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        // Map the Clerk update format to our user table
        const updates: any = {};
        
        if (data.firstName || data.lastName) {
          updates.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        }
        
        if (data.imageUrl) {
          updates.imageUrl = data.imageUrl;
        }
        
        if (data.publicMetadata) {
          if (data.publicMetadata.role) {
            updates.role = data.publicMetadata.role;
          }
        }
        
        // Update the user
        const { data: updatedUser, error } = await supabase
          .from("users")
          .update(updates)
          .eq("id", userQuery.data.id)
          .select("*")
          .single();
          
        if (error) {
          throw new Error(`Failed to update user: ${error.message}`);
        }
        
        return formatUserForClerk(updatedUser);
      }
    }
  };
}

/**
 * Formats a Supabase user to look like a Clerk user
 */
function formatUserForClerk(userData: any) {
  if (!userData) return null;
  
  return {
    id: userData.clerk_id || userData.provider_id || userData.id,
    firstName: userData.name?.split(' ')[0] || null,
    lastName: userData.name?.split(' ').slice(1).join(' ') || null,
    username: null,
    fullName: userData.name || null,
    emailAddresses: [{ 
      emailAddress: userData.email,
      id: "email_" + userData.id,
      verification: { status: "verified" }
    }],
    primaryEmailAddress: { 
      emailAddress: userData.email,
      id: "email_" + userData.id,
      verification: { status: "verified" }
    },
    imageUrl: userData.imageUrl || null,
    publicMetadata: {
      role: userData.role || 'user'
    },
    privateMetadata: {},
    unsafeMetadata: {},
    lastSignInAt: userData.last_login || null,
    createdAt: userData.created_at || null
  };
}

/**
 * Helper function to get user ID from NextAuth session in a Clerk-compatible way
 */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }
  
  // Try to get the Supabase user to find clerk_id if available
  const { data: userData } = await supabase
    .from("users")
    .select("id, clerk_id, provider_id")
    .eq("email", session.user.email)
    .single();
    
  // Return IDs in this priority: clerk_id (for backward compatibility), provider_id, supabase id
  return userData?.clerk_id || userData?.provider_id || userData?.id || session.user.id;
}

/**
 * Get auth() object with user property - Clerk compatibility
 */
export function auth() {
  return {
    getSession: async () => {
      const session = await getServerSession(authOptions);
      if (!session) {
        return null;
      }
      return {
        user: {
          ...session.user,
        }
      };
    },
    userId: async () => {
      return getUserId();
    },
    sessionClaims: async () => {
      const session = await getServerSession(authOptions);
      return session?.user || null;
    }
  };
}

/**
 * Use with server component to check if user is authenticated and has admin role
 */
export async function checkAdmin() {
  const user = await currentUser();
  
  if (!user) {
    return false;
  }
  
  return user.publicMetadata.role === 'super_admin';
}

/**
 * Use with client components to get session
 */
export async function useServerSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

/**
 * Helper to check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await currentUser();
  return user?.publicMetadata?.role === role;
}
