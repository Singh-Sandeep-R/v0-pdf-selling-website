import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("[v0] WEB3FORMS_ACCESS_KEY is not set");
      return NextResponse.json(
        { error: "Email service not configured. Please contact skillcrazyai@gmail.com directly." },
        { status: 500 }
      );
    }

    const payload = {
      access_key: accessKey,
      subject: `[SkillCrazyAI] ${subject}`,
      from_name: name,
      replyto: email,
      "Sender Name": name,
      "Sender Email": email,
      "Subject": subject,
      "Message": message,
    };

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await web3Response.json();
    console.log("[v0] Web3Forms response:", JSON.stringify(result));

    if (!result.success) {
      console.error("[v0] Web3Forms error:", result.message);
      return NextResponse.json(
        { error: result.message || "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[v0] Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
