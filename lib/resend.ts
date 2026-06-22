import nodemailer from 'nodemailer';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// SMTP settings
const SMTP_HOST = process.env.EMAIL_SMTP_HOST;
const SMTP_PORT = process.env.EMAIL_SMTP_PORT;
const SMTP_USER = process.env.EMAIL_SMTP_USER;
const SMTP_PASS = process.env.EMAIL_SMTP_PASS;
const SMTP_FROM = process.env.EMAIL_SMTP_FROM || SMTP_USER || 'onboarding@resend.dev';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // If SMTP configurations are present, send via SMTP (e.g. Gmail)
  if (SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(SMTP_PORT || '465'),
        secure: (SMTP_PORT || '465') === '465', // true for 465, false for other ports (like 587)
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        html,
      });

      console.log(`[CVio Email SMTP] E-posta başarıyla gönderildi: ${info.messageId}`);
      return { data: info };
    } catch (err: any) {
      console.error(`[CVio Email SMTP] E-posta gönderim hatası: ${err.message}`);
      return { error: err.message };
    }
  }

  // Fallback to Resend API
  if (!RESEND_API_KEY) {
    console.warn('[CVio Email Mock] Resend API Key ve SMTP bilgisi yok. E-posta konsola yazdırılıyor:');
    console.log(`To: ${to}\nSubject: ${subject}\nContent length: ${html.length}`);
    return { data: { mock: true } };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Resend API call failed: ${errorText}`);
      return { error: errorText };
    }

    const data = await res.json();
    return { data };
  } catch (err: any) {
    console.error(`Error sending email: ${err.message}`);
    return { error: err.message };
  }
}
