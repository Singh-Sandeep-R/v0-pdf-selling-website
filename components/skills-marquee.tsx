"use client";

import { useEffect, useRef } from "react";

const skills = [
  { label: "Machine Learning", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "Deep Learning", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "Statistics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Python", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "Neural Networks", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
  { label: "Data Wrangling", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
  { label: "Visualization", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" },
  { label: "A/B Testing", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { label: "Transformers", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { label: "MLOps", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { label: "TensorFlow", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Regression", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
];

function SkillPill({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="group flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
      <svg
        className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={icon}
        />
      </svg>
      <span className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {label}
      </span>
    </div>
  );
}

export function SkillsMarquee() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!row1 || !row2) return;

    let raf1: number;
    let raf2: number;
    let pos1 = 0;
    let pos2 = 0;

    const speed1 = 0.4;
    const speed2 = 0.3;

    function animate() {
      if (row1) {
        pos1 -= speed1;
        const halfWidth = row1.scrollWidth / 2;
        if (Math.abs(pos1) >= halfWidth) pos1 = 0;
        row1.style.transform = `translateX(${pos1}px)`;
      }
      if (row2) {
        pos2 += speed2;
        const halfWidth = row2.scrollWidth / 2;
        if (pos2 >= halfWidth) pos2 = 0;
        row2.style.transform = `translateX(${pos2 - row2.scrollWidth / 2}px)`;
      }
      raf1 = requestAnimationFrame(animate);
    }

    raf1 = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  const firstHalf = skills.slice(0, 6);
  const secondHalf = skills.slice(6);

  return (
    <section className="overflow-hidden py-12" aria-label="Skills covered in our books">
      <div className="mx-auto mb-8 max-w-7xl px-6 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Topics Covered Across All Books
        </h3>
      </div>

      {/* Row 1 - scrolls left */}
      <div className="relative mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
        <div ref={row1Ref} className="flex gap-4" style={{ width: "max-content" }}>
          {[...firstHalf, ...firstHalf, ...firstHalf, ...firstHalf].map((skill, i) => (
            <SkillPill key={`r1-${i}`} label={skill.label} icon={skill.icon} />
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls right */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
        <div ref={row2Ref} className="flex gap-4" style={{ width: "max-content" }}>
          {[...secondHalf, ...secondHalf, ...secondHalf, ...secondHalf].map((skill, i) => (
            <SkillPill key={`r2-${i}`} label={skill.label} icon={skill.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
