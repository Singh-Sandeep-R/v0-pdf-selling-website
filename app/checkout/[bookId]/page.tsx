import { books } from "@/lib/books";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckoutClient } from "@/components/checkout-client";

export function generateStaticParams() {
  return books.map((book) => ({ bookId: book.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = books.find((b) => b.id === bookId);
  if (!book) return { title: "Book Not Found" };
  return {
    title: `Buy ${book.title} - SkillCrazyAI`,
    description: book.description,
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CheckoutClient book={book} />
      <Footer />
    </div>
  );
}
