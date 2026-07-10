import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    // No email provider configured (local dev, or not set up yet in prod).
    // Print the link so the flow is still testable end to end.
    console.log(`[email:dev] Enlace de recuperación para ${to}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "EJECUTA <onboarding@resend.dev>",
    to,
    subject: "Recupera el acceso a tu cuenta de EJECUTA",
    html: `
      <div style="font-family: sans-serif; background: #0F0C09; color: #F2ECE2; padding: 32px;">
        <p style="color: #E3C9A0; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px;">EJECUTA</p>
        <p style="font-size: 16px;">Pediste restablecer tu contraseña.</p>
        <p>
          <a href="${resetUrl}" style="background: #E3C9A0; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 999px; display: inline-block;">
            Elegir nueva contraseña
          </a>
        </p>
        <p style="color: #8a8072; font-size: 12px;">
          Este enlace expira en 1 hora. Si no pediste esto, ignora el correo.
        </p>
      </div>
    `,
  });
}

export async function sendReminderEmail(
  to: string,
  habitName: string,
  mantra: string,
  appUrl: string,
  unsubscribeUrl: string
) {
  if (!resend) {
    console.log(`[email:dev] Recordatorio para ${to}: "${habitName}" pendiente hoy.`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "EJECUTA <onboarding@resend.dev>",
    to,
    subject: `Hoy todavía no has hecho: ${habitName}`,
    html: `
      <div style="font-family: sans-serif; background: #0F0C09; color: #F2ECE2; padding: 32px;">
        <p style="color: #E3C9A0; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px;">EJECUTA</p>
        <p style="font-size: 20px; font-weight: bold; margin: 16px 0 8px;">Todavía no marcas "${habitName}" hoy.</p>
        <p style="color: #8a8072; font-size: 14px; margin-bottom: 20px;">No pasa nada si es tarde. La única regla real es no fallar dos días seguidos.</p>
        <p>
          <a href="${appUrl}" style="background: #E3C9A0; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 999px; display: inline-block;">
            Marcarlo ahora
          </a>
        </p>
        <p style="color: #F2ECE2; font-size: 14px; font-style: italic; margin-top: 28px; border-left: 2px solid #E3C9A0; padding-left: 12px;">
          &ldquo;${mantra}&rdquo;
        </p>
        <p style="color: #544c40; font-size: 11px; margin-top: 32px;">
          <a href="${unsubscribeUrl}" style="color: #544c40;">Dejar de recibir estos recordatorios</a>
        </p>
      </div>
    `,
  });
}

export async function sendFeedbackNotification(
  userEmail: string,
  message: string,
  pageUrl: string | null
) {
  const to = process.env.FEEDBACK_TO_EMAIL ?? "jaywrkr@gmail.com";

  if (!resend) {
    console.log(`[email:dev] Feedback de ${userEmail} (${pageUrl ?? "?"}): ${message}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "EJECUTA <onboarding@resend.dev>",
    to,
    reply_to: userEmail,
    subject: `Feedback en EJECUTA de ${userEmail}`,
    html: `
      <div style="font-family: sans-serif; background: #0F0C09; color: #F2ECE2; padding: 32px;">
        <p style="color: #E3C9A0; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px;">EJECUTA · Feedback</p>
        <p style="font-size: 14px; color: #8a8072;">De: ${escapeHtml(userEmail)}</p>
        ${pageUrl ? `<p style="font-size: 14px; color: #8a8072;">Página: ${escapeHtml(pageUrl)}</p>` : ""}
        <p style="font-size: 16px; white-space: pre-wrap; margin-top: 16px;">${escapeHtml(message)}</p>
      </div>
    `,
  });
}
