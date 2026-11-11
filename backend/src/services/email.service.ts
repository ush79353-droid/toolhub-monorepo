import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export interface EmailService {
  sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
}

function resetUrl(resetToken: string): string {
  const origin = env.CORS_ORIGIN.split(',')[0].trim().replace(/\/$/, '');
  return `${origin}/admin/reset-password?token=${encodeURIComponent(resetToken)}`;
}

export class SmtpEmailService implements EmailService {
  public async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    if (env.EMAIL_PROVIDER !== 'smtp') {
      logger.info(
        `[EmailService] Password reset requested for ${email}. EMAIL_PROVIDER is not smtp; no email sent.`
      );
      return false;
    }

    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.EMAIL_FROM) {
      logger.error(
        '[EmailService] SMTP is selected but SMTP_HOST, SMTP_USER, SMTP_PASS, or EMAIL_FROM is missing.'
      );
      return false;
    }

    const link = resetUrl(resetToken);
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Reset your Omega Calculators admin password',
        text: [
          'A password reset was requested for your Omega Calculators admin account.',
          'This link expires in 15 minutes:',
          link,
          '',
          'If you did not request this, you can ignore this email.',
        ].join('\n'),
        html: `<p>A password reset was requested for your Omega Calculators admin account.</p>
<p><a href="${link}">Reset your password</a></p>
<p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>`,
      });
    } catch (error) {
      logger.error('[EmailService] Failed to send password reset email', error);
      throw new AppError(
        'Password reset email could not be sent. Try again shortly.',
        503,
        'EMAIL_DELIVERY_FAILED'
      );
    }

    logger.info(`[EmailService] Password reset email sent to ${email}`);
    return true;
  }
}

export const emailService: EmailService = new SmtpEmailService();
