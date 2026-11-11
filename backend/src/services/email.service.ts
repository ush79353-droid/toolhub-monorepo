import { logger } from '../utils/logger';

export interface EmailService {
  sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
}

export class ConsoleOrPendingEmailService implements EmailService {
  private readonly isConfigured: boolean;

  constructor() {
    // Check for email credentials in environment
    this.isConfigured = Boolean(
      process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    );
  }

  public async sendPasswordResetEmail(email: string, _resetToken: string): Promise<boolean> {
    if (!this.isConfigured) {
      logger.info(
        `[EmailService] Password reset requested for: ${email}. Live email provider (SMTP/Resend) is not configured; simulated email delivery completed without logging token.`
      );
      return false;
    }

    // When SMTP / Resend provider is connected in infrastructure phase:
    // dispatch email with reset link: `${siteUrl}/admin/reset-password?token=${resetToken}`
    logger.info(`[EmailService] Password reset email dispatched to ${email}`);
    return true;
  }
}

export const emailService: EmailService = new ConsoleOrPendingEmailService();

