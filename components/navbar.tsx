"use client";

import Link from "next/link";
import { BookOpen, Terminal } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              SkillCrazyAI
            </span>
            <span className="ml-2 hidden rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary sm:inline">
              books
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <a
            href="mailto:skillcrazyai@gmail.com"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
