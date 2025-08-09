import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!userFound) throw new Error("Invalid Email");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password,
        );

        if (!passwordMatch) throw new Error("Invalid Password");
        
        // Return user with all necessary fields including role
        return {
          _id: userFound._id.toString(),
          email: userFound.email,
          name: userFound.name,
          phone: userFound.phone,
          role: userFound.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      if (trigger === "update" && session?.email) {
        token.email = session.email;
      }

      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u._id,
          phone: u.phone,
          role: u.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          _id: token.id,
          name: token.name,
          phone: token.phone,
          role: token.role,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // If user is signing in, check their role and redirect accordingly
      if (url.startsWith("/api/auth/callback")) {
        return baseUrl;
      }
      
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // If it's the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // Default to base URL
      return baseUrl;
    },
  },
};
