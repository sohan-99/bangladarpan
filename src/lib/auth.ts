import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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
          console.log('🔍 Login attempt for:', credentials.email);
          
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
            console.log('❌ User not found:', credentials.email);
            throw new Error("Invalid email or password");
          }

          console.log('✅ User found:', user.email, '(ID:', user.id, ')');
          console.log('📋 User roles:', user.userRoles.map((ur: { role: { name: string } }) => ur.role.name));

          // Compare passwords using bcrypt
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          console.log('🔐 Password verification:', passwordMatch ? 'Success' : 'Failed');

          // Compare passwords
          if (!passwordMatch) {
            console.log('❌ Password mismatch!');
            throw new Error("Invalid email or password");
          }

          console.log('✅ Password match!');

          // Check if user has admin role
          const hasAdminRole = user.userRoles.some(
            (ur: { role: { name: string } }) => ur.role.name === "admin"
          );

          if (!hasAdminRole) {
            console.log('❌ User does not have admin role');
            throw new Error("Access denied. Admin role required");
          }

          console.log('✅ Admin role verified. Login successful!');

          // Return user data for session
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.fullName || user.email,
            role: "admin",
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error('❌ Auth error:', error.message);
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
