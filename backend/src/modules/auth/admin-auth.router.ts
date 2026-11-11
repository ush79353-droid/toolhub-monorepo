import { Router } from 'express';
import { adminAuthController } from './admin-auth.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import {
  loginRateLimiter,
  forgotPasswordRateLimiter,
} from '../../middleware/rate-limit.middleware';

export const adminAuthRouter = Router();

// Public auth endpoints
adminAuthRouter.post('/login', loginRateLimiter, (req, res, next) => {
  adminAuthController.login(req, res, next);
});

adminAuthRouter.post('/forgot-password', forgotPasswordRateLimiter, (req, res, next) => {
  adminAuthController.forgotPassword(req, res, next);
});

adminAuthRouter.post('/reset-password', forgotPasswordRateLimiter, (req, res, next) => {
  adminAuthController.resetPassword(req, res, next);
});

// Protected auth endpoints
adminAuthRouter.use(authenticateAdmin);

adminAuthRouter.post('/logout', (req, res, next) => {
  adminAuthController.logout(req, res, next);
});

adminAuthRouter.get('/me', (req, res, next) => {
  adminAuthController.getMe(req, res, next);
});

adminAuthRouter.patch('/profile', (req, res, next) => {
  adminAuthController.updateProfile(req, res, next);
});

adminAuthRouter.post('/change-password', (req, res, next) => {
  adminAuthController.changePassword(req, res, next);
});
