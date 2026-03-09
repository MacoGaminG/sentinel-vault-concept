"use client";

import { useState } from "react";
import { createNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, PlusCircle } from "lucide-react";

export function AddNoteForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // Simulation de l'ID utilisateur 1 pour le moment
    const result = await createNote(1, title, content);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // On réinitialise le formulaire et on rafraîchit la page pour voir la note
      (event.target as HTMLFormElement).reset();
      setLoading(false);
      window.location.reload();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-2 text-zinc-400">
        <PlusCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Nouvelle entrée sécurisée</span>
      </div>

      <div className="space-y-2">
        <Input
          name="title"
          placeholder="Titre du secret (ex: Codes Serveur)"
          required
          className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700"
        />
      </div>

      <div className="space-y-2">
        <Textarea
          name="content"
          placeholder="Contenu à chiffrer..."
          required
          className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 min-h-25 focus:ring-1 focus:ring-zinc-700"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <ShieldAlert className="w-4 h-4" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black hover:bg-zinc-200 font-semibold transition-all"
      >
        {loading ? "Chiffrement AES en cours..." : "Protéger cette note"}
      </Button>

      <p className="text-[10px] text-center text-zinc-600 mt-2 uppercase tracking-widest">
        End-to-End Encrypted Logic
      </p>
    </form>
  );
}
