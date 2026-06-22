import { sendEmail } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { email, fullName } = await req.json();

    if (!email) {
      return Response.json({ error: 'E-posta adresi eksik' }, { status: 400 });
    }

    const name = fullName || 'Kullanıcı';
    const firstName = name.split(' ')[0];

    const welcomeHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CVio'ya Hoş Geldiniz</title>
</head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4ff;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,81,213,0.10);">

          <!-- ── HEADER BANNER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#0051d5 0%,#7073ff 100%);padding:40px 48px 36px;">
              <!-- Logo -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.2);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                          <span style="font-size:20px;">✦</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">CV<span style="opacity:0.85;">io</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Hero Text -->
              <p style="margin:28px 0 0;font-size:30px;font-weight:800;color:#ffffff;line-height:1.25;letter-spacing:-0.5px;">
                Kariyer yolculuğunuz<br/>bugün başlıyor 🚀
              </p>
              <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.80);line-height:1.5;">
                Merhaba <strong style="color:#ffffff;">${firstName}</strong>, CVio ailesine hoş geldiniz!
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:40px 48px 0;">

              <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                Hesabınız başarıyla oluşturuldu. Artık yapay zeka destekli akıllı CV platformumuzla
                <strong style="color:#0051d5;">dakikalar içinde</strong> profesyonel özgeçmişinizi hazırlayabilir,
                doğrudan paylaşabilir ve iş görüşmelerinizi kazanabilirsiniz.
              </p>

              <!-- Feature Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8f9ff;border:1px solid #e2e8f5;border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td style="width:40px;vertical-align:top;padding-top:2px;font-size:22px;">⚡</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#0b1c30;">60 Saniyede Profesyonel CV</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#64748b;line-height:1.5;">Manuel doldur ya da LinkedIn profilini içe aktar — AI geri kalanını tamamlar.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8f9ff;border:1px solid #e2e8f5;border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td style="width:40px;vertical-align:top;padding-top:2px;font-size:22px;">🎯</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#0b1c30;">ATS Geçiş Garantisi</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#64748b;line-height:1.5;">Gemini AI ile CV'nizi iş tanımına göre optimize et, elenme riskini ortadan kaldır.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8f9ff;border:1px solid #e2e8f5;border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td style="width:40px;vertical-align:top;padding-top:2px;font-size:22px;">🔗</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#0b1c30;">Kalıcı Paylaşım Linki</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#64748b;line-height:1.5;">cvio.app/cv/adınız formatında kişisel kariyer linkinizle her yerden erişim.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/cv/new"
                       style="display:inline-block;background:linear-gradient(135deg,#0051d5,#7073ff);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:12px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(0,81,213,0.30);">
                      İlk CV'nizi Oluşturun →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e8ecf5;margin:0 0 28px;" />

              <!-- Stats Row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
                <tr>
                  <td align="center" width="33%" style="text-align:center;">
                    <p style="margin:0;font-size:22px;font-weight:800;color:#0051d5;">2.400+</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;font-weight:600;">Aktif Kullanıcı</p>
                  </td>
                  <td align="center" width="33%" style="text-align:center;border-left:1px solid #e8ecf5;border-right:1px solid #e8ecf5;">
                    <p style="margin:0;font-size:22px;font-weight:800;color:#7073ff;">%94</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;font-weight:600;">Mülakat Başarısı</p>
                  </td>
                  <td align="center" width="33%" style="text-align:center;">
                    <p style="margin:0;font-size:22px;font-weight:800;color:#10b981;">4.9 ★</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;font-weight:600;">Kullanıcı Puanı</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#f8f9ff;border-top:1px solid #e8ecf5;padding:28px 48px;border-radius:0 0 20px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:13px;color:#64748b;line-height:1.6;">
                      Bu e-posta <strong style="color:#0b1c30;">CVio</strong> otomatik sistemi tarafından <strong>${email}</strong> adresine gönderilmiştir.
                    </p>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">
                      Hesap oluşturmadıysanız bu e-postayı güvenle yok sayabilirsiniz.
                    </p>
                  </td>
                  <td align="right" style="vertical-align:bottom;">
                    <span style="font-size:20px;font-weight:800;color:#c6c6cd;letter-spacing:-0.5px;">CVio</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Log for mock mode when no Resend key
    if (!process.env.RESEND_API_KEY) {
      console.log(`[CVio Email Mock] Hoş geldin emaili gönderilecekti: ${email} (${fullName})`);
      return Response.json({ success: true, mock: true });
    }

    // Send to owner for monitoring
    await sendEmail({
      to: 'cemas4140@gmail.com',
      subject: `🎉 Yeni Kayıt: ${name} (${email})`,
      html: welcomeHtml,
    });

    // Send to user
    try {
      if (email !== 'cemas4140@gmail.com') {
        await sendEmail({
          to: email,
          subject: 'CVio\'ya Hoş Geldiniz! 🚀',
          html: welcomeHtml,
        });
      }
    } catch (e) {
      console.warn('Kullanıcıya email gönderilemedi (Resend sandbox limiti):', e);
    }

    return Response.json({ success: true });
  } catch (err: any) {
    console.error('Welcome email API error:', err);
    return Response.json({ error: err.message || 'E-posta gönderilemedi' }, { status: 500 });
  }
}
