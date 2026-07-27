import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const COLORS = {
  bg: "#000000",
  card: "#0A0A0A",
  border: "#262626",
  text: "#F5F5F5",
  muted: "#A3A3A3",
  faint: "#6B6B6B",
  accent: "#FFFFFF",
};

/** Table-based shell shared by every transactional email — the same black/
 * white look as the app, wrapped in the boilerplate HTML email clients need
 * (Outlook/Gmail don't reliably render flexbox, so everything below is
 * tables + inline styles). `preheader` is the invisible preview text shown
 * next to the subject line in inbox lists. */
function emailShell({
  preheader,
  kicker,
  bodyHtml,
  footerHtml,
}: {
  preheader: string;
  kicker: string;
  bodyHtml: string;
  footerHtml?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background:${COLORS.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg}; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%; background:${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; overflow: hidden;">
            <tr>
              <td style="padding: 36px 32px 8px;">
                <p style="margin:0; color:${COLORS.accent}; text-transform:uppercase; letter-spacing:0.2em; font-size:11px; font-weight:700;">Ankla</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 32px 0;">
                <p style="margin:0 0 20px; color:${COLORS.muted}; text-transform:uppercase; letter-spacing:0.14em; font-size:11px; font-weight:600;">${escapeHtml(kicker)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 36px; color:${COLORS.text}; font-size:15px; line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%;">
            <tr>
              <td style="padding: 20px 8px 0; color:${COLORS.faint}; font-size:11px; line-height:1.6; text-align:center;">
                ${footerHtml ?? "Ankla — Sistema de Ejecución Sostenible"}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function ctaButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0 4px;">
      <tr>
        <td style="border-radius: 999px; background:${COLORS.accent};">
          <a href="${url}" style="display:inline-block; padding: 13px 28px; color:${COLORS.bg}; font-weight:700; font-size:14px; text-decoration:none; border-radius:999px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    // No email provider configured (local dev, or not set up yet in prod).
    // Print the link so the flow is still testable end to end.
    console.log(`[email:dev] Enlace de recuperación para ${to}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Ankla <onboarding@resend.dev>",
    to,
    subject: "Recupera el acceso a tu cuenta de Ankla",
    html: emailShell({
      preheader: "Elige una contraseña nueva — el enlace expira en 1 hora.",
      kicker: "Recuperar acceso",
      bodyHtml: `
        <p style="margin:0 0 4px; font-size:19px; font-weight:800; color:${COLORS.text};">Pediste restablecer tu contraseña.</p>
        <p style="margin:8px 0 0; color:${COLORS.muted};">Un solo clic y eliges una nueva.</p>
        ${ctaButton(resetUrl, "Elegir nueva contraseña")}
        <p style="margin:24px 0 0; color:${COLORS.faint}; font-size:12px;">
          Este enlace expira en 1 hora. Si no pediste esto, ignora el correo — tu cuenta sigue segura.
        </p>
      `,
    }),
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
    from: process.env.EMAIL_FROM ?? "Ankla <onboarding@resend.dev>",
    to,
    subject: `Hoy todavía no has hecho: ${habitName}`,
    html: emailShell({
      preheader: `Todavía no marcas "${habitName}" hoy. Tienes hasta 2 fallos por ciclo.`,
      kicker: "Recordatorio de hoy",
      bodyHtml: `
        <p style="margin:0 0 4px; font-size:19px; font-weight:800; color:${COLORS.text};">
          Todavía no marcas &ldquo;${escapeHtml(habitName)}&rdquo; hoy.
        </p>
        <p style="margin:8px 0 0; color:${COLORS.muted};">
          No pasa nada si es tarde. Tienes hasta 2 fallos dentro del ciclo — no se trata de ser
          perfecto, se trata de no dejarlo ir.
        </p>
        ${ctaButton(appUrl, "Marcarlo ahora")}
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 28px;">
          <tr>
            <td style="border-left: 2px solid ${COLORS.accent}; padding-left: 14px; color:${COLORS.text}; font-size:13px; font-style:italic;">
              &ldquo;${escapeHtml(mantra)}&rdquo;
            </td>
          </tr>
        </table>
      `,
      footerHtml: `<a href="${unsubscribeUrl}" style="color:${COLORS.faint};">Dejar de recibir estos recordatorios</a>`,
    }),
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
    from: process.env.EMAIL_FROM ?? "Ankla <onboarding@resend.dev>",
    to,
    reply_to: userEmail,
    subject: `Feedback en Ankla de ${userEmail}`,
    html: emailShell({
      preheader: message.slice(0, 120),
      kicker: "Feedback recibido",
      bodyHtml: `
        <p style="margin:0 0 2px; color:${COLORS.muted}; font-size:13px;">De: <span style="color:${COLORS.text};">${escapeHtml(userEmail)}</span></p>
        ${pageUrl ? `<p style="margin:0 0 16px; color:${COLORS.muted}; font-size:13px;">Página: <span style="color:${COLORS.text};">${escapeHtml(pageUrl)}</span></p>` : `<div style="margin-bottom:16px;"></div>`}
        <p style="margin:0; white-space:pre-wrap; color:${COLORS.text};">${escapeHtml(message)}</p>
      `,
    }),
  });
}
