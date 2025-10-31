import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Find user by email with their roles
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              userRoles: {
                include: {
                  role: true,
                },
              },
            },
          });

          // Check if user exists
          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Hash the input password using SHA2-256 (matching your database)
          const hashedPassword = crypto
            .createHash("sha256")
            .update(credentials.password)
            .digest("hex");

          // Compare passwords
          if (user.password !== hashedPassword) {
            throw new Error("Invalid email or password");
          }

          // Check if user has admin role
          const hasAdminRole = user.userRoles.some(
            (ur: { role: { name: string } }) => ur.role.name === "admin"
          );

          if (!hasAdminRole) {
            throw new Error("Access denied. Admin role required");
          }

          // Return user data for session
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.fullName || user.email,
            role: "admin",
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
