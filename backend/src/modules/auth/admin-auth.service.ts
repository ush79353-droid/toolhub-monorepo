import crypto from 'node:crypto';
import { AdminUser, type SafeAdminUser } from '../admins/admin-user.model';
import { AdminSession } from './admin-session.model';
import { hashPassword, verifyPassword } from '../../utils/password';
import { AppError } from '../../middleware/error.middleware';
import { emailService } from '../../services/email.service';
import type {
  LoginInput,
  ProfileUpdateInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../../validation/auth.schema';

export interface LoginResult {
  user: SafeAdminUser;
  sessionId: string;
  expiresAt: Date;
}

export class AdminAuthService {
  /**
   * Authenticate admin with Argon2id and create database-backed session
   */
  public async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string
  ): Promise<LoginResult> {
    const email = input.email.trim().toLowerCase();

    // Query user including passwordHash
    const user = await AdminUser.findOne({ email }).select('+passwordHash');

    if (!user) {
      // Generic error to prevent email enumeration
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new AppError(
        `Account is temporarily locked due to repeated failed login attempts. Try again in ${remainingMinutes} minute(s).`,
        429,
        'ACCOUNT_LOCKED'
      );
    }

    // Verify password with Argon2id
    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        // Lock for 15 minutes after 5 consecutive failures
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check status
    if (user.status !== 'active') {
      throw new AppError(
        'This administrator account has been disabled. Contact system support.',
        403,
        'ACCOUNT_DISABLED'
      );
    }

    // Reset login failures and update login timestamp
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    // Generate cryptographically secure session ID
    const sessionId = crypto.randomBytes(32).toString('hex');
    const sessionDurationMs = input.rememberMe
      ? 7 * 24 * 60 * 60 * 1000 // 7 days
      : 24 * 60 * 60 * 1000; // 24 hours

    const expiresAt = new Date(Date.now() + sessionDurationMs);

    // Persist session to MongoDB (TTL index cleans up automatically)
    await AdminSession.create({
      sessionId,
      adminId: user._id,
      role: user.role,
      expiresAt,
      ipAddress,
      userAgent,
      lastActiveAt: new Date(),
    });

    return {
      user: user.toSafeObject(),
      sessionId,
      expiresAt,
    };
  }

  /**
   * Terminate active session in MongoDB
   */
  public async logout(sessionId: string): Promise<void> {
    if (!sessionId) return;
    await AdminSession.deleteOne({ sessionId });
  }

  /**
   * Retrieve current verified admin user
   */
  public async getMe(adminId: string): Promise<SafeAdminUser> {
    const user = await AdminUser.findById(adminId);
    if (!user) {
      throw new AppError('Administrator record not found', 404, 'NOT_FOUND');
    }
    return user.toSafeObject();
  }

  /**
   * Update basic profile info (name only; email requires verified migration)
   */
  public async updateProfile(adminId: string, input: ProfileUpdateInput): Promise<SafeAdminUser> {
    const user = await AdminUser.findById(adminId);
    if (!user) {
      throw new AppError('Administrator record not found', 404, 'NOT_FOUND');
    }

    user.name = input.name.trim();
    await user.save();

    return user.toSafeObject();
  }

  /**
   * Change admin password, verify old password with Argon2id, and revoke all active sessions
   */
  public async changePassword(adminId: string, input: ChangePasswordInput): Promise<void> {
    const user = await AdminUser.findById(adminId).select('+passwordHash');
    if (!user) {
      throw new AppError('Administrator record not found', 404, 'NOT_FOUND');
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new AppError('Current password is incorrect', 400, 'INVALID_CURRENT_PASSWORD');
    }

    // Hash new password using Argon2id
    const newPasswordHash = await hashPassword(input.newPassword);

    user.passwordHash = newPasswordHash;
    user.passwordChangedAt = new Date();
    user.failedLoginAttempts = 0;
    await user.save();

    // Revoke all existing sessions across all devices for this administrator
    await AdminSession.deleteMany({ adminId: user._id });
  }

  /**
   * Generate password reset token, save hash, and trigger email delivery
   */
  public async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const email = input.email.trim().toLowerCase();
    const user = await AdminUser.findOne({ email });

    // Always return generic confirmation to protect against email enumeration
    const genericResponse = {
      message:
        'If an active administrator account exists for this email, password reset instructions have been dispatched.',
    };
    console.log(`[AdminAuthService] Forgot password request for email: ${email}, user: ${user}, status: ${user?.status}`);
    if (!user || user.status !== 'active') {
      return genericResponse;
    }

    // Generate cryptographically random 32-byte reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');

    // Hash token with SHA-256 for secure database storage
    const tokenHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    // Set 15-minute token expiration
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const sent = await emailService.sendPasswordResetEmail(user.email, rawResetToken);
    if (!sent) {
      throw new AppError(
        'Password reset email could not be sent. Try again shortly.',
        503,
        'EMAIL_DELIVERY_FAILED'
      );
    }

    return genericResponse;
  }

  /**
   * Reset password using single-use reset token
   */
  public async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(input.token.trim()).digest('hex');

    // Find user with active matching reset token
    const user = await AdminUser.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError(
        'Password reset link is invalid or has expired. Please request a new one.',
        400,
        'INVALID_RESET_TOKEN'
      );
    }

    // Hash new password with Argon2id
    const newPasswordHash = await hashPassword(input.newPassword);

    user.passwordHash = newPasswordHash;
    user.passwordChangedAt = new Date();
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Invalidate all active sessions to enforce fresh login
    await AdminSession.deleteMany({ adminId: user._id });

    return {
      message: 'Password has been successfully reset. Please sign in with your new password.',
    };
  }
}

export const adminAuthService = new AdminAuthService();
