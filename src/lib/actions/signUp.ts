"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hash } from "@node-rs/argon2";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Champs manquants" };
  }

  const hashedPassword = await hash(password);

  try {
    await db.insert(users).values({
      email,
      hashedPassword,
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return { error: "Utilisateur déjà existant ou erreur DB" };
  }
}
