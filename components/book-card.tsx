"use client";

import React from "react"

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Layers, FileText, ArrowRight } from "lucide-react";
import type { Book } from "@/lib/books";

export function BookCard({ book }: { book: Book }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const levelColors: Record<string, string> = {
    Beginner: "bg-emerald-500/20 text-emerald-400",
    Intermediate: "bg-amber-500/20 text-amber-400",
    Advanced: "bg-rose-500/20 text-rose-400",
  };

  const discount = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 ease-out"
        style={{
          transform: isHovered
            ? `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) translateZ(20px)`
            : "rotateY(0deg) rotateX(0deg) translateZ(0px)",
          boxShadow: isHovered
            ? "0 25px 60px -12px rgba(0, 200, 220, 0.15), 0 0 30px -5px rgba(0, 200, 220, 0.1)"
            : "0 4px 20px -4px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: isHovered
              ? `radial-gradient(600px circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(0, 200, 220, 0.06), transparent 40%)`
              : "none",
          }}
        />

        {/* Book Cover */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt={`${book.title} book cover`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {/* Discount badge */}
          <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 font-mono text-xs font-bold text-primary-foreground">
            {`-${discount}%`}
          </div>

          {/* Level badge */}
          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColors[book.level]}`}
            >
              {book.level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-20 p-6">
          <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
            {book.title}
          </h3>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {book.subtitle}
          </p>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {book.chapters} Chapters
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {book.pages} Pages
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              PDF
            </span>
          </div>

          {/* Topics */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {book.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground"
              >
                {topic}
              </span>
            ))}
            {book.topics.length > 4 && (
              <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {`+${book.topics.length - 4}`}
              </span>
            )}
          </div>

          {/* Price & CTA */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${book.price}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice}
              </span>
            </div>
            <Link
              href={`/checkout/${book.id}`}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-lg hover:shadow-primary/25"
            >
              Buy Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
