import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    return NextResponse.json({ error: "No orders found" }, { status: 404 });
  }

  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));

  const order = orders.find((o: any) => o.token === token);

  if (!order) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
  // Check if token expired
const now = new Date();
const expiry = new Date(order.expiresAt);

if (now > expiry) {
  return NextResponse.json(
    { error: "Download link has expired." },
    { status: 403 }
  );
}


const fileName = order.bookId.replace(/-/g, " ");
const pdfPath = path.join(
  process.cwd(),
  "data",
  "books",
  `${order.bookId}.pdf`
);


  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const pdfBuffer = fs.readFileSync(pdfPath);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.bookId}.pdf"`,

    },
  });
}
