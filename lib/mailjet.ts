import Mailjet from 'node-mailjet'

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY!,
  apiSecret: process.env.MAILJET_API_SECRET!,
})

export async function sendPurchaseNotification({
  devEmail,
  buyerEmail,
  appTitle,
}: {
  devEmail: string
  buyerEmail: string
  appTitle: string
}) {
  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: { Email: 'info@goplanify.com', Name: 'AppGrid' },
        To: [{ Email: devEmail }],
        Subject: `Nueva compra: ${appTitle}`,
        HTMLPart: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem;">
            <div style="margin-bottom:1.5rem;">
              <span style="font-weight:700;font-size:1.1rem;">AppGrid</span>
            </div>
            <h2 style="margin:0 0 0.75rem;font-size:1.25rem;">Nuevo comprador</h2>
            <p style="color:#555;margin:0 0 1.5rem;">
              <strong>${buyerEmail}</strong> quiere acceso a <strong>${appTitle}</strong>.
            </p>
            <p style="color:#555;margin:0 0 1.5rem;">
              Verificá el pago en MercadoPago y enviále el acceso desde tu panel de admin.
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin"
               style="display:inline-block;background:#C6F24E;color:#0A0A0A;font-weight:600;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;">
              Ver en Admin →
            </a>
          </div>
        `,
      },
    ],
  })
}
