"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth"; // On va s'assurer que cette action existe
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Succès : redirection vers le dashboard
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-zinc-950">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-zinc-400 text-center">
            Accédez à votre coffre-fort sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nom@exemple.ch"
                required
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-zinc-950 border-zinc-800"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200"
              disabled={loading}
            >
              {loading ? "Vérification..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-500">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-white hover:underline">
              S&apos;inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
