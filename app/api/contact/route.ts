import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store message in data/messages.json
    const messagesPath = path.join(process.cwd(), "data", "messages.json");

    let messages = [];
    try {
      const existing = fs.readFileSync(messagesPath, "utf-8");
      messages = JSON.parse(existing);
    } catch {
      // File doesn't exist yet, start fresh
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true, messageId: newMessage.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
