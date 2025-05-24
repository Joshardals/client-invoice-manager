import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { SessionStrategy } from "next-auth";
import { sign } from "jsonwebtoken";
import { sendVerificationMail } from "./mailer";
import { addMinutes } from "date-fns";
import { generateVerificationCode } from "./utils";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ✅ Email not verified check
        if (!user.emailVerified) {
          // Create a new verification session token
          const verificationSessionToken = sign(
            { userId: user.id, email: user.email },
            process.env.NEXTAUTH_SECRET!,
            { expiresIn: "10m" }
          );

          // Delete any existing verification tokens for this user
          await prisma.verificationToken.deleteMany({
            where: { userId: user.id },
          });

          // Generate and save new verification code
          const newVerificationCode = generateVerificationCode();
          await prisma.verificationToken.create({
            data: {
              token: newVerificationCode,
              userId: user.id,
              expires: addMinutes(new Date(), 10),
            },
          });

          // Send new verification code
          await sendVerificationMail(user.email, newVerificationCode);

          throw new Error(`unverified:${verificationSessionToken}`);
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // This will only be executed at login. Each next invocation will skip this part.
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        };
        token.lastRefresh = Date.now();
      }

      // Return previous token if the access token has not expired yet
      const shouldRefreshTime = Math.floor(
        (Date.now() - token.lastRefresh) / 1000
      );
      if (shouldRefreshTime < 5 * 60) {
        // less than 5 minutes
        return token;
      }

      // Refresh the token
      token.lastRefresh = Date.now();
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Optional: custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);
