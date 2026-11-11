import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type AdminRole = 'super_admin' | 'admin';
export type AdminStatus = 'active' | 'disabled';

export interface SafeAdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(): SafeAdminUser;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      maxlength: [100, 'Admin name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Hidden by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['super_admin', 'admin'],
        message: '{VALUE} is not a valid administrative role',
      },
      default: 'admin',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'disabled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
      required: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetTokenHash: {
      type: String,
      select: false,
    },
    passwordResetExpiresAt: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'admin_users',
  }
);

// Method to safely return user object without passwordHash or tokens
adminUserSchema.methods.toSafeObject = function (): SafeAdminUser {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    lastLoginAt: this.lastLoginAt,
    passwordChangedAt: this.passwordChangedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', adminUserSchema);
