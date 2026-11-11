import type { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { AdminSession } from '../modules/auth/admin-session.model';
import { AdminUser, type AdminRole } from '../modules/admins/admin-user.model';

export function extractSessionToken(req: Request): string | null {
  const customHeader = req.headers['x-admin-session'];
  if (typeof customHeader === 'string' && customHeader.trim()) {
    return customHeader.trim();
  }

  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return null;
}

export async function authenticateAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sessionId = extractSessionToken(req);

    if (!sessionId) {
      throw new AppError('Authentication session token is required', 401, 'UNAUTHORIZED');
    }

    // Look up active database session
    const session = await AdminSession.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      throw new AppError(
        'Session is invalid or has expired. Please sign in again.',
        401,
        'SESSION_EXPIRED'
      );
    }

    // Look up admin user record
    const user = await AdminUser.findById(session.adminId);

    if (!user) {
      // Invalidate orphaned session
      await AdminSession.deleteOne({ _id: session._id });
      throw new AppError(
        'Associated administrative account no longer exists',
        401,
        'ACCOUNT_NOT_FOUND'
      );
    }

    if (user.status !== 'active') {
      // Account disabled: revoke session immediately
      await AdminSession.deleteOne({ _id: session._id });
      throw new AppError(
        'Your administrator account has been disabled. Contact system support.',
        403,
        'ACCOUNT_DISABLED'
      );
    }

    // Touch session activity
    session.lastActiveAt = new Date();
    await session.save().catch(() => {});

    // Attach verified admin and session to request
    req.admin = user.toSafeObject();
    req.adminSession = session;

    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(allowedRoles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin) {
      return next(
        new AppError('Authentication required prior to role verification', 401, 'UNAUTHORIZED')
      );
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return next(
        new AppError(
          'Insufficient administrative privileges for this resource',
          403,
          'FORBIDDEN_INSUFFICIENT_ROLE'
        )
      );
    }

    next();
  };
}
