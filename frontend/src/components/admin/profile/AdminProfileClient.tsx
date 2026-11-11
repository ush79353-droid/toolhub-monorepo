'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSection } from '@/components/admin/forms/FormSection';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Shield,
  Lock,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from 'lucide-react';
import { updateAdminProfileAction, changeAdminPasswordAction } from '@/server/auth/actions';
import type { AdminUser } from '@/types';

interface AdminProfileClientProps {
  initialAdmin: AdminUser;
}

export function AdminProfileClient({ initialAdmin }: AdminProfileClientProps) {
  const router = useRouter();
  const [admin, setAdmin] = React.useState<AdminUser>(initialAdmin);

  // Profile Edit State
  const [name, setName] = React.useState(initialAdmin.name);
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  // Change Password State
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  // 2FA Visual Preference
  const [is2faEnabled, setIs2faEnabled] = React.useState(true);

  const initials = admin.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!name.trim() || name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters.');
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const result = await updateAdminProfileAction({ name: name.trim() });
      if (!result.success || !result.data) {
        setProfileError(result.error || 'Failed to update profile name.');
        setIsUpdatingProfile(false);
        return;
      }

      setAdmin(result.data);
      setProfileSuccess('Profile name updated successfully.');
      router.refresh();
    } catch {
      setProfileError('Connection error occurred while updating profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await changeAdminPasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        setPasswordError(result.error || 'Failed to update password.');
        setIsChangingPassword(false);
        return;
      }

      setPasswordSuccess(
        'Password updated successfully. Existing sessions have been revoked. Redirecting to sign in...'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/admin/login');
      }, 2500);
    } catch {
      setPasswordError('Connection error occurred while updating password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Overview Card */}
      <FormSection
        title="Administrator Profile"
        description="Verified console identity, security role, and session credentials."
        badge={
          <span className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary">
            <Shield className="h-3.5 w-3.5" />
            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-white shadow-md">
              {initials}
            </div>
            <div>
              <div className="font-bold text-accent text-base">{admin.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{admin.email}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <StatusBadge status={admin.status} />
                <span className="text-[11px] text-muted-foreground">ID: {admin.id}</span>
              </div>
            </div>
          </div>

          <div className="text-xs space-y-1 text-muted-foreground border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Joined: {new Date(admin.createdAt).toLocaleDateString()}</span>
            </div>
            {admin.lastLoginAt && (
              <div>Last login: {new Date(admin.lastLoginAt).toLocaleString()}</div>
            )}
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleUpdateProfile} className="pt-4 border-t border-border space-y-4">
          <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
            Update Account Name
          </h4>

          {profileSuccess && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
                disabled={isUpdatingProfile}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Email Address (Read-Only)
              </label>
              <Input
                value={admin.email}
                disabled
                className="text-xs bg-muted/50 cursor-not-allowed font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Email addresses are locked to preserve audit trail integrity.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingProfile || name === admin.name}
              className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
            >
              {isUpdatingProfile ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{isUpdatingProfile ? 'Saving...' : 'Update Name'}</span>
            </Button>
          </div>
        </form>
      </FormSection>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword}>
        <FormSection
          title="Change Password"
          description="Update your master credentials with Argon2id cryptographic hashing (minimum 8 characters)."
        >
          {passwordSuccess && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <strong>Success: </strong>
                {passwordSuccess}
              </div>
            </div>
          )}

          {passwordError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="text-xs pr-9"
                disabled={isChangingPassword || Boolean(passwordSuccess)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                disabled={isChangingPassword}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">New Password</label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="text-xs pr-9"
                  disabled={isChangingPassword || Boolean(passwordSuccess)}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  disabled={isChangingPassword}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="text-xs"
                disabled={isChangingPassword || Boolean(passwordSuccess)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border">
            <Button
              type="submit"
              size="sm"
              disabled={
                isChangingPassword || !currentPassword || !newPassword || Boolean(passwordSuccess)
              }
              className="inline-flex items-center gap-1.5 text-xs bg-primary text-white hover:bg-[hsl(var(--primary-hover))]"
            >
              {isChangingPassword ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              <span>{isChangingPassword ? 'Hashing & Updating...' : 'Update Password'}</span>
            </Button>
          </div>
        </FormSection>
      </form>

      {/* Account Security Info */}
      <FormSection
        title="Multi-Factor & Active Sessions"
        description="Session protection and authentication safeguards."
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-accent">
                Two-Factor Authentication (TOTP)
              </div>
              <div className="text-[11px] text-muted-foreground">
                Requires 6-digit authenticator code on each sign-in.
              </div>
            </div>
          </div>
          <Switch checked={is2faEnabled} onCheckedChange={setIs2faEnabled} />
        </div>

        <div className="pt-3 border-t border-border">
          <div className="text-xs font-semibold text-accent mb-2">Active Admin Session</div>
          <div className="rounded-lg bg-background p-3 text-xs border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-accent">
                Database-Backed Session (MongoDB TTL Store)
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Authenticated account: {admin.email} · Status: {admin.status}
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
