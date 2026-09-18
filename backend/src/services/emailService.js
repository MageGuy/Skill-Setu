// Email service for Skill-Setu.
//
// Uses nodemailer. If SMTP credentials are not configured (no SMTP_HOST env),
// it falls back to a "console logger" mode that prints the email body to the
// terminal — so the quarterly check-in flow works in dev without an email
// gateway.
//
// To enable real email delivery, set these env vars in backend/.env:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_USER=your-email@gmail.com
//   SMTP_PASS=your-app-password

const nodemailer = require('nodemailer');

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  if (process.env.SMTP_HOST) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Dev mode: use a JSON transport that just renders the email to a string.
    _transporter = nodemailer.createTransport({
      jsonTransport: true
    });
  }

  return _transporter;
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Skill-Setu Portal <noreply@skillsetu.gov.in>',
    to,
    subject,
    text: text || subject,
    html: html || `<p>${subject}</p>`
  });

  // In dev mode (jsonTransport), log the rendered email so devs can see what
  // would have been sent.
  if (!process.env.SMTP_HOST) {
    console.log('\n📧 [DEV EMAIL] ========================================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('------------------------------------------------------');
    console.log(text || '(no plain-text body)');
    console.log('======================================================\n');
  }

  return info;
}

// Build the quarterly check-in email body.
function buildCheckInEmailHtml(studentName, checkInCycle, checkInUrl) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #102A43; color: #fff; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 1.5rem;">Skill-Setu Quarterly Check-in</h1>
        <p style="margin: 4px 0 0; opacity: 0.85;">Cycle: ${checkInCycle}</p>
      </div>
      <div style="padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Hello ${studentName},</p>
        <p>
          As part of our ongoing commitment to track and support your career journey,
          we'd like to check in on your current employment status.
        </p>
        <p>
          Please take 2 minutes to update your employment status. If you're looking for
          new opportunities, we can refer you to companies with matching open drives.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${checkInUrl}"
             style="background: #1976A8; color: #fff; padding: 12px 32px; text-decoration: none;
                    border-radius: 6px; font-weight: 700; display: inline-block;">
            Update My Status
          </a>
        </div>
        <p style="font-size: 0.85rem; color: #64748B;">
          If the button doesn't work, copy and paste this link: ${checkInUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;">
        <p style="font-size: 0.8rem; color: #94A3B8;">
          This is an automated email from Skill-Setu (Skill-सेतु), AICTE Sovereign Education Rail.
          If you did not expect this email, please ignore it.
        </p>
      </div>
    </div>
  `;
}

module.exports = { sendEmail, buildCheckInEmailHtml };
