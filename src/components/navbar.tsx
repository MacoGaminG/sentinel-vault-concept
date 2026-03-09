"use client";

import Link from "next/link";
import { ShieldCheck, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ShieldCheck className="w-6 h-6 text-white" />
            <span className="font-bold text-lg tracking-tight">
              Sentinel Vault
            </span>
          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Mon Coffre
            </Link>

            <div className="h-4 w-px bg-zinc-800" />

            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
              onClick={() => (window.location.href = "/")}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Quitter
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
