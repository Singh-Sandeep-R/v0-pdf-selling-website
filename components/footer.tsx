import Link from "next/link";
import { Terminal, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">SkillCrazyAI</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Books</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
            <a href="mailto:skillcrazyai@gmail.com" className="flex items-center gap-1.5 transition-colors hover:text-primary">
              <Mail className="h-3.5 w-3.5" />
              skillcrazyai@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
            <span>SkillCrazyAI &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
