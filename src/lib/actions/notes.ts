"use server";

import { db } from "@/lib/db";
import { secureNotes } from "@/lib/db/schema";
import { decrypt, encrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";

export async function createNote(
  userId: number,
  title: string,
  content: string,
) {
  // Chiffrement AES-256 avant insertion
  const { iv, content: encryptedContent } = encrypt(content);

  try {
    await db.insert(secureNotes).values({
      userId,
      title,
      encryptedContent,
      iv,
    });
    return { success: "Note chiffrée et sauvegardée !" };
  } catch (e) {
    console.error("Erreur lors du stockage:", e);
    return { error: "Erreur lors du stockage." };
  }
}

export async function getUserNotes(userId: number) {
  try {
    const notes = await db
      .select()
      .from(secureNotes)
      .where(eq(secureNotes.userId, userId));

    // On déchiffre chaque note avant de l'envoyer au composant
    return notes.map((note) => ({
      id: note.id,
      title: note.title,
      content: decrypt(note.encryptedContent, note.iv), // Déchiffrement à la volée
    }));
  } catch (e) {
    console.error("Erreur de déchiffrement:", e);
    return [];
  }
}

export async function deleteNote(noteId: number) {
  try {
    await db.delete(secureNotes).where(eq(secureNotes.id, noteId));
    return { success: true };
  } catch (e) {
    console.error("Erreur lors de la suppression:", e);
    return { error: "Impossible de supprimer la note." };
  }
}
