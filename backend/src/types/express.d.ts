import type { SafeAdminUser } from '../modules/admins/admin-user.model';
import type { IAdminSession } from '../modules/auth/admin-session.model';

declare global {
  namespace Express {
    interface Request {
      admin?: SafeAdminUser;
      adminSession?: IAdminSession;
    }
  }
}
