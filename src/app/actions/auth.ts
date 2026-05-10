"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signIn } from "@/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { getPrisma } from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
  });

  if (existing) {
    redirect("/login?message=Account already exists");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);
  await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      passwordHash,
    },
  });

  await sendWelcomeEmail({ email: parsed.email, name: parsed.name });
  await signIn("credentials", {
    email: parsed.email.toLowerCase(),
    password: parsed.password,
    redirectTo: "/dashboard",
  });
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?message=${encodeURIComponent("Invalid email or password")}`);
    }

    throw error;
  }
}
