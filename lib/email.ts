import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export async function sendOtpEmail(to: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    
    // In dev / test or if no key provided, log to console for instant testing
    if (!resend) {
      console.log(`\n========================================`);
      console.log(`[FreshFind Auth DEV] OTP Code for ${to}: ${code}`);
      console.log(`========================================\n`);
      return { success: true };
    }

    const fromAddress = process.env.EMAIL_FROM || 'FreshFind <onboarding@resend.dev>';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FreshFind Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#020617;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#0f172a;border:1px solid #1e293b;border-radius:24px;padding:36px 32px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="display:inline-block;background:linear-gradient(135deg, #10b981, #059669);padding:12px;border-radius:18px;box-shadow:0 10px 15px -3px rgba(16,185,129,0.3);">
                <span style="font-size:28px;line-height:1;">🌱</span>
              </div>
              <h1 style="margin:16px 0 4px 0;font-size:24px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">FreshFind</h1>
              <p style="margin:0;font-size:13px;color:#94a3b8;">Surplus Food Rescue & Eco-Marketplace</p>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#f1f5f9;">Your One-Time Login Code</h2>
              <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.5;">Enter this 6-digit code in FreshFind to log in and start rescuing food.</p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:16px 0 24px 0;">
              <div style="background-color:#020617;border:2px solid #10b981;border-radius:16px;padding:18px 24px;display:inline-block;letter-spacing:8px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:32px;font-weight:900;color:#34d399;box-shadow:0 0 25px rgba(16,185,129,0.15);">
                ${code}
              </div>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0;font-size:12px;color:#64748b;">⏳ This code expires in <strong style="color:#e2e8f0;">10 minutes</strong>. Do not share it with anyone.</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #1e293b;padding-top:20px;" align="center">
              <p style="margin:0 0 4px 0;font-size:11px;color:#475569;">If you did not request this login code, you can safely ignore this email.</p>
              <p style="margin:0;font-size:11px;color:#334155;">© ${new Date().getFullYear()} FreshFind Rwanda. Saving meals, cutting emissions.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject: `${code} is your FreshFind login code`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      // Fallback logging in console
      console.log(`[FreshFind Auth Fallback] Code for ${to}: ${code}`);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('sendOtpEmail exception:', err);
    console.log(`[FreshFind Auth Exception Fallback] Code for ${to}: ${code}`);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}
