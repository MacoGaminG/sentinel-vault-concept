import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .regex(/[A-Z]/, "Il faut au moins une majuscule")
    .regex(/[0-9]/, "Il faut au moins un chiffre")
    .regex(/[^a-zA-Z0-9]/, "Il faut au moins un caractère spécial"),
});
