import nodemailer from "nodemailer";

const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendVerificationMail(to: string, code: string) {
  const info = await transporter.sendMail({
    from: `${SMTP_USER}`,
    to,
    subject: "Verify your email",
    html: `
       <h2>Welcome!</h2>
        <p>Please verify your email address by entering this code:</p>
        <h3 style="font-size: 24px; letter-spacing: 2px; background: #f4f4f4; padding: 10px; display: inline-block;">${code}</h3>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
    `,
  });

  console.log("Message sent: %s", info.messageId);
}

export async function sendPasswordResetMail(to: string, resetUrl: string) {
  const info = await transporter.sendMail({
    from: `${SMTP_USER}`,
    to,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });

  console.log("Message sent: %s", info.messageId);
}
