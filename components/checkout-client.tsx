"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, Layers } from "lucide-react";
import type { Book } from "@/lib/books";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutClient({ book }: { book: Book }) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const discount = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!buyerName.trim() || !buyerEmail.trim()) {
      alert("Please enter name and email");
      return;
    }

    setIsLoading(true);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
        }),
      });

      if (!res.ok) {
        alert("Failed to create order.");
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "SkillCrazyAI",
        description: book.title,
        order_id: data.orderId,
handler: function (response: any) {
  document.body.innerHTML = `
    <div style="
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      background:#000;
      color:white;
      font-family:sans-serif;
    ">
      <div style="text-align:center;">
        <div style="
          width:40px;
          height:40px;
          border:4px solid #0ea5e9;
          border-top:4px solid transparent;
          border-radius:50%;
          margin:0 auto 20px auto;
          animation:spin 1s linear infinite;
        "></div>
        <p>Redirecting to secure verification...</p>
      </div>
    </div>

    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  window.location.replace(
    `/success?paymentId=${response.razorpay_payment_id}` +
    `&orderId=${response.razorpay_order_id}` +
    `&signature=${response.razorpay_signature}` +
    `&bookId=${book.id}` +
    `&email=${buyerEmail}`
  );
},


        prefill: {
          name: buyerName,
          email: buyerEmail,
        },
        theme: {
          color: "#0ea5e9",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
        setIsLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
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

          {/* Right: Checkout */}
          <div className="lg:col-span-3">
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
                      ₹{book.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{book.originalPrice}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-primary">
                    SAVE {discount}%
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h3 className="text-lg font-bold text-foreground">
                Your Details
              </h3>

              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  disabled={isLoading}
                  className="mt-2 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : `Pay ₹${book.price}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
