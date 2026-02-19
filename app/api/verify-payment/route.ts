import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookId,
      email,
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false });
    }

    let orders: any[] = [];
    if (fs.existsSync(ORDERS_FILE)) {
      orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
    }

    // ✅ PREVENT DUPLICATE PROCESSING
    const existingOrder = orders.find(
      (o) => o.paymentId === razorpay_payment_id
    );

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        token: existingOrder.token,
      });
    }

    // Only generate new token if not processed before
    const token = crypto.randomBytes(32).toString("hex");

const now = new Date();
const expiresAt = new Date(now.getTime() + 60 * 1000); // 24 Hours

orders.push({
  bookId,
  email,
  paymentId: razorpay_payment_id,
  token,
  amount : body.amount,
  status: "paid",
  createdAt: now.toISOString(),
  expiresAt: expiresAt.toISOString(),
});


    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // 🔥 SEND EMAIL (ONLY ON FIRST PROCESS)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download?token=${token}`;

    await transporter.sendMail({
      from: `"SkillCrazyAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your SkillCrazyAI Book is Ready 📘",
      html: `
        <div style="font-family:Arial;padding:30px;background:#0f172a;color:white">
          <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:12px">
            <h2 style="color:#0ea5e9">Payment Successful 🎉</h2>
            <p>Thank you for purchasing <strong>${bookId.replace(
              /-/g,
              " "
            )}</strong>.</p>
            <p>Your download is ready.</p>
            <div style="text-align:center;margin:30px 0">
              <a href="${downloadLink}" 
                 style="background:#0ea5e9;color:white;padding:14px 24px;
                 text-decoration:none;border-radius:8px;font-weight:bold">
                 Download Your Book
              </a>
            </div>
            <p style="font-size:13px;color:#94a3b8">
              If the button doesn't work, copy this link:
              <br/>
              ${downloadLink}
            </p>
            <hr style="margin:30px 0;border-color:#1f2937"/>
            <p style="font-size:12px;color:#64748b">
              SkillCrazyAI — Premium Data Science & ML Books
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
