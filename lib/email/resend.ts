import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set. Please configure your environment variables.');
  }
  return new Resend(apiKey);
}

export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<void> {
  const resend = getResendClient();

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
    to: email,
    subject: 'Connexion - Streamer Achievement Encyclopedia',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #5fcaee 0%, #dbe0e3 100%); border-radius: 16px; padding: 40px; text-align: center;">
          <h1 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 24px;">
            Connexion Admin
          </h1>
          <p style="color: #333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
            Cliquez sur le bouton ci-dessous pour vous connecter à votre tableau de bord.
          </p>
          <a href="${magicLink}"
             style="display: inline-block;
                    background: #1a1a2e;
                    color: white;
                    padding: 16px 32px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s;">
            Se connecter
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px; line-height: 1.5;">
            Ce lien expire dans <strong>15 minutes</strong> et ne peut être utilisé qu'une seule fois.
          </p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet email.
        </p>
      </div>
    `,
  });
}
