import { NextResponse } from "next/server";
import { books } from "@/lib/books";
import fs from "node:fs";
import path from "node:path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const txnId = searchParams.get("txnId");

    if (!bookId || !txnId) {
      return NextResponse.json(
        { error: "Missing bookId or transaction ID." },
        { status: 400 }
      );
    }

    // Verify the book exists
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    // Verify the transaction exists in orders
    let orders: Array<{
      bookId: string;
      transactionId: string;
      status: string;
    }> = [];
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const data = fs.readFileSync(ORDERS_FILE, "utf-8");
        orders = JSON.parse(data);
      }
    } catch {
      // If orders file doesn't exist or is corrupted
    }

    const validOrder = orders.find(
      (o) =>
        o.bookId === bookId &&
        o.transactionId === txnId &&
        o.status === "confirmed"
    );

    if (!validOrder) {
      return NextResponse.json(
        {
          error:
            "Invalid or unconfirmed transaction. Please complete payment first.",
        },
        { status: 403 }
      );
    }

    // Serve PDF from private data/books/ folder (not publicly accessible)
    const pdfPath = path.join(
      process.cwd(),
      "data",
      "books",
      `${bookId}.pdf`
    );

    if (fs.existsSync(pdfPath)) {
      const pdfBuffer = fs.readFileSync(pdfPath);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${book.title.replace(/\s+/g, "-")}.pdf"`,
        },
      });
    }

    // If no PDF exists yet, return a message
    return NextResponse.json(
      {
        message: `Thank you for purchasing "${book.title}". Your PDF will be delivered shortly. Transaction: ${txnId}`,
        note: "Place your PDF files in /public/books/{book-id}.pdf to enable downloads.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
