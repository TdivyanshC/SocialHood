import { NextRequest, NextResponse } from "next/server";
import { getTransporter, autoReplyHtml } from "../../../lib/mail";

export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const company = payload.company?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.error("Contact form: SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD are not configured.");
    return NextResponse.json(
      { error: "Email isn't configured on the server yet. Please email team@thesocialhood.in directly." },
      { status: 500 }
    );
  }

  const fromAddress = `"The SocialHood" <${process.env.SMTP_USER}>`;
  const toAddress = process.env.CONTACT_TO_EMAIL || "team@thesocialhood.in";
  const firstName = name.split(" ")[0];

  try {
    // Internal notification — reply-to is the visitor, so the team can hit "reply" directly.
    // This is the business-critical send; if it fails, the request fails.
    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` (${company})` : ""}`,
      text: [
        `Name: ${name}`,
        company ? `Company: ${company}` : null,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("Contact form send failure:", err);
    return NextResponse.json(
      { error: "Couldn't send your message. Please email team@thesocialhood.in directly." },
      { status: 502 }
    );
  }

  // Branded auto-reply to the visitor — best-effort. A bounce or typo'd address
  // here shouldn't make the visitor think their enquiry never arrived.
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "We've got your message — The SocialHood",
      html: autoReplyHtml(firstName),
    });
  } catch (err) {
    console.error("Contact form auto-reply failed (lead notification still sent):", err);
  }

  return NextResponse.json({ ok: true });
}
