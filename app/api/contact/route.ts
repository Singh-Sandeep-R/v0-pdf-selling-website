import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    console.log("[v0] Contact form submission received:", { name, email, subject });

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
    console.log("[v0] Access key present:", !!accessKey);

    if (!accessKey) {
      return NextResponse.json(
        { error: "Email service not configured. Please contact skillcrazyai@gmail.com directly." },
        { status: 500 }
      );
    }

    // Use FormData approach (Web3Forms recommended)
    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("subject", `[SkillCrazyAI] ${subject}`);
    formData.append("from_name", name);
    formData.append("replyto", email);
    formData.append("message", `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`);

    console.log("[v0] Sending to Web3Forms...");

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const responseText = await web3Response.text();
    console.log("[v0] Web3Forms raw response:", responseText);
    console.log("[v0] Web3Forms status:", web3Response.status);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("[v0] Failed to parse Web3Forms response");
      return NextResponse.json(
        { error: `Web3Forms returned invalid response (status ${web3Response.status})` },
        { status: 500 }
      );
    }

    if (!result.success) {
      console.error("[v0] Web3Forms error:", result.message);
      return NextResponse.json(
        { error: result.message || "Failed to send message" },
        { status: 500 }
      );
    }

    console.log("[v0] Email sent successfully!");
    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[v0] Contact API error:", errorMessage);
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
