import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    if (!process.env.SMTP_HOST) return null;

 transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    family: 4,
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT) || 10000,
    auth: process.env.SMTP_USER
        ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          }
        : undefined,
});
    return transporter;
}

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
    const mail = getTransporter();

    const subject = "Reset your BlogSpace password";
    const text = `We received a request to reset your BlogSpace password.\n\nReset it here (valid for 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`;
    const html = `
        <p>We received a request to reset your BlogSpace password.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a> (valid for 1 hour).</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
    `;

    if (!mail) {
        console.log(`[mailer] SMTP is not configured. Password reset link for ${to}: ${resetUrl}`);
        return { delivered: false };
    }

    try {
        await mail.sendMail({
            from: process.env.MAIL_FROM || "no-reply@blogspace.local",
            to,
            subject,
            text,
            html,
        });
        return { delivered: true };
    } catch (error) {
        const connectionErrorCodes = ["ETIMEDOUT", "ECONNREFUSED", "ENETUNREACH", "EHOSTUNREACH"];
        if (connectionErrorCodes.includes(error.code)) {
            console.warn(`[mailer] SMTP is unreachable. Password reset link for ${to}: ${resetUrl}`);
            return { delivered: false, fallback: true };
        }
        throw error;
    }
};
