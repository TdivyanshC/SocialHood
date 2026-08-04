// Shared transactional email helpers for the contact form (app/api/contact/route.ts).
// Auto-reply copy is intentionally framed as "sent by the same kind of system we
// build for clients" — a light, honest brand touch rather than a generic autoresponder.
import nodemailer from "nodemailer";

export function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export function autoReplyHtml(firstName: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f2;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0a0a0a;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:40px 40px 24px 40px;">
                <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#00B98E;font-weight:600;">
                  AI Systems Studio
                </p>
                <p style="margin:0;font-size:20px;color:#D4AF37;font-weight:600;">
                  The SocialHood
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px;">
                <h1 style="margin:0 0 20px 0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:500;">
                  Hi ${firstName}, we've got it.
                </h1>
                <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.65);">
                  This confirmation went out the instant your message landed — no one
                  had to click send. It's the same kind of system we build for our
                  clients: nothing sits in a queue untouched.
                </p>
                <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.65);">
                  A real person from our team is reading your message next and will
                  follow up within one business day with next steps.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <p style="margin:0 0 10px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#00B98E;">
                        What happens next
                      </p>
                      <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.7);">
                        1 &nbsp;·&nbsp; We read what you sent — properly, not a bot skim.
                      </p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.7);">
                        2 &nbsp;·&nbsp; You'll hear from us within one business day with a clear next step.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 40px 40px;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.65);">
                  Talk soon,<br />
                  <span style="color:#ffffff;">The SocialHood Team</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0 0 4px 0;font-size:12px;color:rgba(255,255,255,0.35);">
                  team@thesocialhood.in &nbsp;·&nbsp; +91 8799712556 &nbsp;·&nbsp; Delhi NCR, India
                </p>
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
                  You're receiving this because you submitted a message at thesocialhood.in.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
