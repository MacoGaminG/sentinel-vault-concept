import { getUserNotes, deleteNote } from "@/lib/actions/notes";
import { AddNoteForm } from "@/components/security/AddNoteForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Trash2, ShieldCheck, Database } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function DashboardPage() {
  // Pour le prototype, on utilise l'ID utilisateur 1.
  // En avril, tu pourras expliquer que c'est ici qu'on récupère l'ID via le cookie de session.
  const userId = 1;
  const notes = await getUserNotes(userId);

  // Server Action locale pour gérer la suppression et rafraîchir les données
  async function handleDelete(formData: FormData) {
    "use server";
    const noteId = Number(formData.get("noteId"));
    await deleteNote(noteId);
    revalidatePath("/dashboard"); // Force Next.js à recharger les données de la page
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* HEADER DU DASHBOARD */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Mon Coffre-fort
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gérez vos secrets chiffrés en local.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-green-500 text-xs font-medium bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <ShieldCheck className="w-3.5 h-3.5 mr-2" />
              AES-256 GCM
            </div>
            <div className="flex items-center text-zinc-400 text-xs font-medium bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
              <Database className="w-3.5 h-3.5 mr-2" />
              SQLite / Bun
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* COLONNE GAUCHE : FORMULAIRE D'AJOUT */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-400" />
                Nouveau Secret
              </h2>
              <AddNoteForm />
            </div>
          </aside>

          {/* COLONNE DROITE : LISTE DES NOTES */}
          <main className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-zinc-300">
              Vos documents déchiffrés
            </h2>

            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                <p className="text-zinc-500 text-sm">
                  Votre coffre est vide pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    className="bg-zinc-900 border-zinc-800 group transition-all hover:border-zinc-700"
                  >
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <CardTitle className="text-md font-medium text-zinc-200">
                        {note.title}
                      </CardTitle>

                      {/* FORMULAIRE DE SUPPRESSION */}
                      <form action={handleDelete}>
                        <input type="hidden" name="noteId" value={note.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                        <Lock className="w-3 h-3 mr-1.5" />
                        Decrypted in real-time
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
