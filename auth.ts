import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { supabase, getUserProfile } from "./lib/supabase"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "fallback-secret-for-development-only-gris-2024",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (authError || !authData.user) {
          // Fallback to the requested demo hardcoded behavior if Supabase is not configured yet
          if (credentials.email === "demo@gris.com" && credentials.password === "demo123") {
            return {
              id: "1",
              name: "Demo User",
              email: "demo@gris.com",
              plan: "PRO",
              role: "USER"
            } as any;
          }
          console.error("Supabase login error:", authError);
          return null;
        }

        // Fetch user profile from public.profiles
        const profile = await getUserProfile(authData.user.id);
        
        return {
          id: authData.user.id,
          name: profile?.full_name || authData.user.user_metadata?.full_name || authData.user.email,
          email: authData.user.email,
          plan: profile?.plan || "FREE",
          role: "USER"
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = (user as any).plan || 'FREE';
        token.role = (user as any).role || 'USER';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string || token.sub;
        (session.user as any).plan = token.plan;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
})
