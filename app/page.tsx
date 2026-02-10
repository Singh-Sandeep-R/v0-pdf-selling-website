import { books } from "@/lib/books";
import { ParticleBackground } from "@/components/particle-background";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { BookCard } from "@/components/book-card";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />

        {/* Books Section */}
        <section id="books" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <span className="font-mono text-sm text-primary">
                {"// explore the collection"}
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Choose Your Next Read
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Each book is designed to take you from concepts to
                implementation. Practical, hands-on, and production-ready.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {books.map((book, index) => (
                <BookCard key={book.id} book={book} priority={index < 3} />
              ))}
            </div>

            {/* Trust Signals */}
            <div className="mt-20 rounded-xl border border-border bg-card/50 p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Secure Payments
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pay securely via UPI. Instant verification and delivery.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Instant Download
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get your PDF immediately after payment confirmation.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Lifetime Access
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Buy once, keep forever. Free updates included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
