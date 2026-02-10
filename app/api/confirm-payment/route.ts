import { NextResponse } from "next/server";
import { books } from "@/lib/books";
import fs from "node:fs";
import path from "node:path";

// In production, use a database. This file-based store works for demo / small-scale use.
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

interface Order {
  bookId: string;
  bookTitle: string;
  buyerName: string;
  buyerEmail: string;
  transactionId: string;
  amount: number;
  status: "pending" | "confirmed";
  createdAt: string;
}

function ensureDataDir() {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

function getOrders(): Order[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookId, buyerName, buyerEmail, transactionId, amount } = body;

    // Validate required fields
    if (!bookId || !buyerName || !buyerEmail || !transactionId || !amount) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    // Validate book exists
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found." },
        { status: 404 }
      );
    }

    // Check for duplicate transaction ID
    const orders = getOrders();
    const duplicate = orders.find((o) => o.transactionId === transactionId);
    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "This transaction ID has already been used.",
        },
        { status: 409 }
      );
    }

    // Create order
    const order: Order = {
      bookId,
      bookTitle: book.title,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      transactionId: transactionId.trim(),
      amount,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    saveOrders(orders);

    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully!",
      orderId: `ORD-${Date.now()}`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
