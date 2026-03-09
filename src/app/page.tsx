import Link from "next/link";
import { Button } from "@/components/ui/button"; // Vérifie que l'import utilise bien ton alias @/
import { ShieldCheck, Lock, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <ShieldCheck className="w-6 h-6" />
          <span>Sentinel Vault</span>
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            asChild
          >
            <Link href="/login">Connexion</Link>
          </Button>
          <Button className="bg-white text-black hover:bg-zinc-200" asChild>
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Sécurité maximale. <br />
          Simplicité totale.
        </h1>
        <p className="text-zinc-400 max-w-150 text-lg mb-12">
          Un coffre-fort numérique moderne conçu avec **Next.js**, **Bun** et un
          chiffrement **AES-256** de bout en bout.
        </p>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 px-8"
            asChild
          >
            <Link href="/register">Commencer</Link>
          </Button>

          {/* CORRECTION ICI : Bouton GitHub stylisé manuellement pour le Dark Mode */}
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
            asChild
          >
            <a
              href="https://github.com/MacoGaminG/sentinel-vault-concept"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir sur GitHub
            </a>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
          <div className="p-8 border border-zinc-900 rounded-2xl bg-zinc-900/50 flex flex-col items-center text-center">
            <Lock className="w-12 h-12 mb-6 text-white" />
            <h3 className="text-xl font-semibold mb-3">Chiffrement AES-256</h3>
            <p className="text-zinc-500 text-sm">
              Vos notes sont chiffrées de bout en bout avant d&apos;atteindre la
              base SQLite.
            </p>
          </div>
          <div className="p-8 border border-zinc-900 rounded-2xl bg-zinc-900/50 flex flex-col items-center text-center">
            <ShieldCheck className="w-12 h-12 mb-6 text-white" />
            <h3 className="text-xl font-semibold mb-3">Argon2id</h3>
            <p className="text-zinc-500 text-sm">
              Authentification robuste utilisant les derniers standards de
              hachage sécurisé.
            </p>
          </div>
          <div className="p-8 border border-zinc-900 rounded-2xl bg-zinc-900/50 flex flex-col items-center text-center">
            <Zap className="w-12 h-12 mb-6 text-white" />
            <h3 className="text-xl font-semibold mb-3">Bun Runtime</h3>
            <p className="text-zinc-500 text-sm">
              Une exécution ultra-rapide optimisée pour les applications
              modernes.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-zinc-600 border-t border-zinc-900">
        <p className="text-sm">
          © 2026 Sentinel Vault — Projet technique Informaticien CFC & Matu
        </p>
      </footer>
    </div>
  );
}
