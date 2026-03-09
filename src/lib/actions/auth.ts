"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/schemas/auth";
import { hash, verify } from "@node-rs/argon2"; // On utilise le nouveau package
import { eq } from "drizzle-orm";

export async function signUp(formData: FormData) {
  // 1. On récupère les valeurs du formulaire
  const email = formData.get("email") as string;
  const password = formData.get("password") as string; // <-- La variable est créée ici !

  // 2. Validation Zod
  const validation = registerSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: "Données invalides. Le mot de passe doit être plus complexe.",
    };
  }

  try {
    const existingUser = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (existingUser) {
      return { error: "Cet email est déjà utilisé." };
    }

    // 3. Hachage sécurisé (C'est ici qu'on utilise la variable 'password')
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db.insert(users).values({
      email,
      hashedPassword,
    });

    return { success: "Compte créé !" };
  } catch (e) {
    console.error(e);
    return { error: "Erreur lors de la création du compte." };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Chercher l'utilisateur
    const user = db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
      return { error: "Identifiants invalides." };
    }

    // 2. Vérifier le mot de passe (Comparaison sécurisée contre les attaques temporelles)
    const isValid = await verify(user.hashedPassword, password);

    if (!isValid) {
      return { error: "Identifiants invalides." };
    }

    // 3. Ici, on simulerait la création d'un cookie de session (ex: avec Lucía Auth ou JWT)
    // Pour ton test immédiat, on retourne un succès
    return { success: "Connexion réussie !", userId: user.id };
  } catch (e) {
    console.error("Erreur lors de la connexion:", e);
    return { error: "Erreur de connexion." };
  }
}
