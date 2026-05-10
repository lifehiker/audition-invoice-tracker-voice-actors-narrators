import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

import { sendWelcomeEmail } from "@/lib/email";
import { env, featureFlags } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const providers: Provider[] = [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        return valid ? user : null;
      },
    }),
  ];

  if (featureFlags.googleAuth) {
    providers.push(
      Google({
        clientId: env.googleClientId,
        clientSecret: env.googleClientSecret,
      }),
    );
  }

  return {
    adapter: PrismaAdapter(getPrisma()),
    secret: env.authSecret,
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    providers,
    callbacks: {
      async jwt({ token, user }) {
        const prisma = getPrisma();
        const userId = user?.id ?? token.sub;

        if (userId) {
          const currentUser = await prisma.user.findUnique({ where: { id: userId } });
          if (currentUser) {
            token.subscriptionStatus = currentUser.subscriptionStatus;
            token.subscriptionTier = currentUser.subscriptionTier;
            token.trialEndsAt = currentUser.trialEndsAt?.toISOString() ?? null;
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
          session.user.subscriptionStatus = (token.subscriptionStatus as string | null | undefined) ?? null;
          session.user.subscriptionTier = (token.subscriptionTier as string | null | undefined) ?? null;
          session.user.trialEndsAt = (token.trialEndsAt as string | null | undefined) ?? null;
        }

        return session;
      },
    },
    events: {
      async linkAccount({ user }) {
        if (user.email) {
          await sendWelcomeEmail({ email: user.email, name: user.name });
        }
      },
    },
  };
});
