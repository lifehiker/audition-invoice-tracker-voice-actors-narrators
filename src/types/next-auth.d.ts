import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      subscriptionStatus?: string | null;
      subscriptionTier?: string | null;
      trialEndsAt?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    subscriptionStatus?: string | null;
    subscriptionTier?: string | null;
    trialEndsAt?: string | null;
  }
}
