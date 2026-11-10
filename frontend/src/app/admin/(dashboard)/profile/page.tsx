'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { FormSection } from '@/components/admin/forms/FormSection';
import { PendingNotice } from '@/components/admin/shared/PendingNotice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Save, Eye, EyeOff, Smartphone } from 'lucide-react';

export default function AdminProfilePage() {
  const [name, setName] = React.useState('Bilal Ahmad');
  const [email, setEmail] = React.useState('bilal@megatools.io');
  const [timezone, setTimezone] = React.useState('UTC+05:00 (Asia/Karachi)');

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [is2faEnabled, setIs2faEnabled] = React.useState(true);

  const [noticeMessage, setNoticeMessage] = React.useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMessage(
      'Profile information update validated. Database persistence for admin user records will be connected during the backend API phase.'
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setNoticeMessage('Please provide both current and new password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setNoticeMessage('New password and confirmation do not match.');
      return;
    }
    setNoticeMessage(
      'Password update simulated. Backend bcrypt hashing and HTTP-only session invalidation will be wired to Express auth endpoints.'
    );
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Admin Profile & Security"
        description="Manage your administrator identity, personal contact preferences, and credential safeguards."
      />

      <PendingNotice message="Security Notice: Profile and credential changes on this screen are UI previews only. No credentials are sent across the network or stored in localStorage." />

      {noticeMessage && (
        <PendingNotice message={noticeMessage} onDismiss={() => setNoticeMessage(null)} />
      )}

      {/* Profile Info Form */}
      <form onSubmit={handleUpdateProfile}>
        <FormSection
          title="Personal Profile Information"
          description="Basic information associated with your console audit events and team communications."
          badge={
            <span className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary">
              <Shield className="h-3.5 w-3.5" />
              Super Admin
            </span>
          }
        >
          <div className="flex items-center gap-4 pb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-white shadow-md">
              BA
            </div>
            <div>
              <div className="font-bold text-accent text-sm">Bilal Ahmad</div>
              <div className="text-xs text-muted-foreground">
                Console Administrator (UID: usr-1)
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2 h-7 text-xs">
                Upload New Avatar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="text-xs" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Email Address
              </label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">Admin Timezone</label>
            <Input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-border">
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Update Profile</span>
            </Button>
          </div>
        </FormSection>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword}>
        <FormSection
          title="Change Password"
          description="Update your admin master password with at least 8 characters and special symbols."
        >
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
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="inline-flex items-center gap-1.5 text-xs text-primary border-teal-200 hover:bg-secondary"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Update Password</span>
            </Button>
          </div>
        </FormSection>
      </form>

      {/* Account Security */}
      <FormSection
        title="Multi-Factor & Active Sessions"
        description="Heightened security controls for high-privilege console accounts."
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
          <div className="text-xs font-semibold text-accent mb-2">Active Admin Sessions</div>
          <div className="rounded-lg bg-background p-3 text-xs border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-accent">
                Windows 11 · Chrome 132 (Current Device)
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                IP: 192.168.1.1 · Active now
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              Current
            </span>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
