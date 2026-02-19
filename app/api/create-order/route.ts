import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { books } from "@/lib/books";

export async function POST(req: Request) {

  const { bookId } = await req.json();

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: book.price * 100, // paise
    currency: "INR",
    receipt: `receipt_${bookId}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
