import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';
import type { AdminRole } from '../admins/admin-user.model';

export interface IAdminSession extends Document {
  sessionId: string;
  adminId: Types.ObjectId;
  role: AdminRole;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSessionSchema = new Schema<IAdminSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL Index: documents automatically purged once expiresAt is reached
      index: { expires: 0 },
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'admin_sessions',
  }
);

export const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession || mongoose.model<IAdminSession>('AdminSession', adminSessionSchema);
