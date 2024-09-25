import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "Type your email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Type your password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }
        if (!credentials?.password) {
          throw new Error("Password is required");
        }

        const user = await prisma.users.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Password incorrect");
        } else {
          return user;
        }
      },
    }),
  ],

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user?.role;
      return { ...user, ...token };
    },
    async session({ session, token }) {
      session.user.role = token?.role;
      return session;
    },
  },
};
