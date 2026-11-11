import type { Request, Response, NextFunction } from 'express';
import { adminAuthService } from './admin-auth.service';
import { sendSuccess } from '../../utils/response';
import { extractSessionToken } from '../../middleware/auth.middleware';
import {
  loginSchema,
  profileUpdateSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validation/auth.schema';

export class AdminAuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await adminAuthService.login(validated, ip, userAgent);

      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = extractSessionToken(req);
      if (sessionId) {
        await adminAuthService.logout(sessionId);
      }
      sendSuccess(res, { message: 'Logged out successfully' }, 200);
    } catch (error) {
      next(error);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.admin) {
        res
          .status(401)
          .json({ success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
        return;
      }
      const admin = await adminAuthService.getMe(req.admin.id);
      sendSuccess(res, admin, 200);
    } catch (error) {
      next(error);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.admin) {
        res
          .status(401)
          .json({ success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
        return;
      }
      const validated = profileUpdateSchema.parse(req.body);
      const updated = await adminAuthService.updateProfile(req.admin.id, validated);
      sendSuccess(res, updated, 200);
    } catch (error) {
      next(error);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.admin) {
        res
          .status(401)
          .json({ success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
        return;
      }
      const validated = changePasswordSchema.parse(req.body);
      await adminAuthService.changePassword(req.admin.id, validated);
      sendSuccess(
        res,
        {
          message:
            'Password updated successfully. All existing sessions revoked. Please sign in again.',
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = forgotPasswordSchema.parse(req.body);
      const result = await adminAuthService.forgotPassword(validated);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      const result = await adminAuthService.resetPassword(validated);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const adminAuthController = new AdminAuthController();
