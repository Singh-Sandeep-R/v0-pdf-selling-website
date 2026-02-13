"use client";

import React from "react"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Layers,
  Check,
  Copy,
  Download,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import type { Book } from "@/lib/books";

const UPI_ID = "sandeeprsingh0@oksbi";

type Step = "details" | "payment" | "confirmed";

export function CheckoutClient({ book }: { book: Book }) {
  const [step, setStep] = useState<Step>("details");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const discount = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  const upiPaymentUrl = `upi://pay?pa=${UPI_ID}&pn=SkillCrazyAI&am=${book.price}&cu=INR&tn=Purchase-${book.id}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentUrl)}`;

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for clipboard API
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim()) return;
    setStep("payment");
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          buyerName,
          buyerEmail,
          transactionId: transactionId.trim(),
          amount: book.price,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("confirmed");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left: Book Details */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={`${book.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {book.title}
                </h2>
                <p className="mt-1 font-mono text-sm text-primary">
                  {book.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {book.description}
                </p>

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

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {book.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Checkout Flow */}
          <div className="lg:col-span-3">
            {/* Progress Steps */}
            <div className="mb-8 flex items-center gap-4">
              {(["details", "payment", "confirmed"] as const).map(
                (s, index) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        step === s
                          ? "bg-primary text-primary-foreground"
                          : index <
                              ["details", "payment", "confirmed"].indexOf(step)
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {index <
                      ["details", "payment", "confirmed"].indexOf(step) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`hidden text-sm font-medium capitalize sm:inline ${
                        step === s
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s === "confirmed" ? "download" : s}
                    </span>
                    {index < 2 && (
                      <div className="mx-2 hidden h-px w-8 bg-border sm:block" />
                    )}
                  </div>
                )
              )}
            </div>

            {/* Order Summary */}
            <div className="mb-6 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">
                    ORDER SUMMARY
                  </span>
                  <h3 className="mt-1 font-semibold text-foreground">
                    {book.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {"₹"}{book.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {"₹"}{book.originalPrice}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-primary">
                    {`SAVE ${discount}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Free Test Download for intro-econometrics */}
            {book.id === "intro-econometrics" && step === "details" && (
              <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
                <p className="mb-3 text-sm font-semibold text-primary">
                  Free Test Download Available
                </p>
                <a
                  href={`/api/download?bookId=${book.id}&txnId=TEST-FREE`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  <Download className="h-5 w-5" />
                  Download Free (Test)
                </a>
                <p className="mt-2 text-xs text-muted-foreground">
                  This is a temporary test link to verify PDF downloads work.
                </p>
              </div>
            )}

            {/* Step 1: Details */}
            {step === "details" && (
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h3 className="text-lg font-bold text-foreground">
                  Your Details
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We need your details to process the order and deliver the PDF.
                </p>

                <form
                  onSubmit={handleProceedToPayment}
                  className="mt-6 flex flex-col gap-5"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block font-mono text-xs text-muted-foreground"
                    >
                      FULL NAME
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block font-mono text-xs text-muted-foreground"
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">
                      Pay via UPI
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scan the QR code or use the UPI ID to make the payment.
                  </p>

                  <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start">
                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-xl border border-border bg-foreground p-3">
                        <Image
                          src={qrCodeUrl || "/placeholder.svg"}
                          alt="UPI QR Code for payment"
                          width={200}
                          height={200}
                          className="rounded-lg"
                          unoptimized
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        Scan with any UPI app
                      </span>
                    </div>

                    {/* Payment Details */}
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <span className="font-mono text-xs text-muted-foreground">
                          UPI ID
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="text-sm font-semibold text-foreground">
                            {UPI_ID}
                          </code>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="rounded-md bg-secondary p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Copy UPI ID"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <span className="font-mono text-xs text-muted-foreground">
                          AMOUNT TO PAY
                        </span>
                        <div className="mt-1 text-xl font-bold text-foreground">
                          {"₹"}{book.price}
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <span className="font-mono text-xs text-muted-foreground">
                          PAYEE NAME
                        </span>
                        <div className="mt-1 font-semibold text-foreground">
                          SkillCrazyAI
                        </div>
                      </div>

                      {/* Mobile UPI deep link */}
                      <a
                        href={upiPaymentUrl}
                        className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/20 md:hidden"
                      >
                        <Smartphone className="h-4 w-4" />
                        Open UPI App
                      </a>
                    </div>
                  </div>
                </div>

                {/* Confirm Payment */}
                <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground">
                    Confirm Your Payment
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    After completing the UPI payment, enter the UPI transaction
                    reference ID below.
                  </p>

                  <form
                    onSubmit={handleConfirmPayment}
                    className="mt-5 flex flex-col gap-4"
                  >
                    <div>
                      <label
                        htmlFor="txnId"
                        className="mb-1.5 block font-mono text-xs text-muted-foreground"
                      >
                        UPI TRANSACTION / REFERENCE ID
                      </label>
                      <input
                        id="txnId"
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g., 412345678901"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    {error && (
                      <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Verifying Payment..."
                        : "Confirm & Get Download"}
                    </button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Your payment details are securely processed.
                    </div>
                  </form>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Go back to details
                </button>
              </div>
            )}

            {/* Step 3: Confirmed / Download */}
            {step === "confirmed" && (
              <div className="rounded-xl border border-primary/30 bg-card p-6 text-center md:p-10">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Payment Received!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Thank you for your purchase, {buyerName}. Your transaction ID{" "}
                  <code className="font-mono text-primary">{transactionId}</code>{" "}
                  has been recorded.
                </p>

                <div className="mx-auto mt-8 max-w-sm rounded-xl border border-border bg-secondary/50 p-6">
                  <p className="mb-4 font-mono text-xs text-muted-foreground">
                    YOUR DOWNLOAD IS READY
                  </p>
                  <a
                    href={`/api/download?bookId=${book.id}&txnId=${transactionId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </a>
                  <p className="mt-3 text-xs text-muted-foreground">
                    A confirmation email will be sent to {buyerEmail}
                  </p>
                </div>

                <Link
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Browse more books
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
