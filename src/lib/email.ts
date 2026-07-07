import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    // No email provider configured (local dev, or not set up yet in prod).
    // Print the link so the flow is still testable end to end.
    console.log(`[email:dev] Enlace de recuperacion para ${to}: ${resetUrl}`);
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
