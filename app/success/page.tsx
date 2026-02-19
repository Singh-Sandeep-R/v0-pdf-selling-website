"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  const signature = searchParams.get("signature");
  const bookId = searchParams.get("bookId");
  const email = searchParams.get("email");

  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [status, setStatus] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          bookId,
          email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setDownloadToken(data.token);
        setStatus("Payment Successful 🎉");
      } else {
        setStatus("Payment verification failed.");
      }

      setLoading(false);
    };

    if (paymentId && orderId && signature) {
      verify();
    }
  }, [paymentId, orderId, signature, bookId, email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-lg font-medium">
            Verifying your payment securely...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please do not refresh this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-black to-background px-6">
      <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-10 shadow-2xl text-center">

        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          <span className="text-4xl text-primary">✓</span>
        </div>

        {/* Status */}
        <h1 className="text-3xl font-bold text-primary mb-4">
          {status}
        </h1>

        <p className="text-muted-foreground mb-6">
          Thank you for your purchase.
        </p>

        {/* Email Info Box */}
        <div className="bg-secondary/30 border border-border rounded-lg p-4 mb-8 text-sm">
          📩 A secure download link has been sent to  
          <span className="text-primary font-semibold"> {email} </span>
          <br />
          Please check your inbox (and spam folder).
        </div>

        {/* Download Button */}
        {downloadToken && (
          <a
            href={`/api/download?token=${downloadToken}`}
            onClick={() => {
              setTimeout(() => {
                window.location.href = "/";
              }, 2000);
            }}
            className="inline-block w-full bg-primary px-6 py-4 rounded-xl font-semibold text-lg text-primary-foreground hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            Download Your Book
          </a>
        )}

        {/* Redirect Note */}
        <p className="text-xs text-muted-foreground mt-6">
          After download, you will be redirected to the homepage.
        </p>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
