import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from './supabase';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub || '';
        
        // Get Supabase user details
        const { data } = await supabase
          .from('users')
          .select('id, role, clerk_id')
          .eq('email', session.user.email)
          .single();
          
        if (data) {
          session.user.role = data.role;
          session.user.supabaseId = data.id;
          
          // If there's a clerk_id, include it too for backward compatibility
          if (data.clerk_id) {
            session.user.clerkId = data.clerk_id;
          }
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign-in
      if (account && user) {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
          
        if (existingUser) {
          // Update existing user
          await supabase
            .from('users')
            .update({
              name: user.name,
              imageUrl: user.image,
              provider: account.provider,
              provider_id: user.id,
              online: true,
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            })
            .eq('id', existingUser.id);
            
          token.supabaseId = existingUser.id;
          token.role = existingUser.role;
          
          // If there's a clerk_id, include it for backward compatibility
          if (existingUser.clerk_id) {
            token.clerkId = existingUser.clerk_id;
          }
        } else {
          // Create new user
          const { data: newUser } = await supabase
            .from('users')
            .insert([
              {
                email: user.email,
                name: user.name,
                imageUrl: user.image,
                provider: account.provider,
                provider_id: user.id,
                role: 'user',
                online: true
              }
            ])
            .select()
            .single();
            
          if (newUser) {
            token.supabaseId = newUser.id;
            token.role = newUser.role;
          }
        }
      }
      return token;
    }
  },
  events: {
    async signOut({ token }) {
      if (token?.supabaseId) {
        await supabase
          .from("users")
          .update({ online: false })
          .eq("id", token.supabaseId);
      }
    },
    async session({ token, session }) {
      if (token?.supabaseId) {
        // Update online status when session is checked
        await supabase
          .from("users")
          .update({ online: true, last_login: new Date().toISOString() })
          .eq("id", token.supabaseId);
      }
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
