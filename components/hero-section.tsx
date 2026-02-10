"use client";

import { useEffect, useState } from "react";

const codeSnippets = [
  "model.fit(X_train, y_train)",
  "accuracy = 0.97",
  "import tensorflow as tf",
  "loss.backward()",
  "df.describe()",
  "plt.scatter(X, y)",
  "torch.nn.Linear(128, 64)",
  "sklearn.ensemble",
];

export function HeroSection() {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet];

    if (isTyping) {
      if (displayed.length < snippet.length) {
        const timeout = setTimeout(() => {
          setDisplayed(snippet.slice(0, displayed.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      }
      const pause = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(pause);
    }

    if (displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1));
      }, 30);
      return () => clearTimeout(timeout);
    }

    setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
    setIsTyping(true);
  }, [displayed, isTyping, currentSnippet]);

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,200,220,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,220,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span className="font-mono text-xs text-muted-foreground">
            Data Science & Machine Learning
          </span>
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Master the Art of{" "}
          <span className="text-primary">Data Science</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Premium technical books crafted for engineers, researchers, and
          practitioners. From fundamentals to production-grade systems.
        </p>

        {/* Typing code terminal */}
        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive/40" />
            <div className="h-3 w-3 rounded-full bg-amber-500/40" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/40" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              python3
            </span>
          </div>
          <div className="flex items-center font-mono text-sm">
            <span className="mr-2 select-none text-primary">{">>>"}</span>
            <span className="text-foreground">{displayed}</span>
            <span className="ml-0.5 inline-block h-5 w-2 animate-pulse bg-primary" />
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-8">
          {[
            { value: "3", label: "Books" },
            { value: "1350+", label: "Pages" },
            { value: "54", label: "Chapters" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-foreground md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
