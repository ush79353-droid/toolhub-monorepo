'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthSplit, authSubmitClass } from '@/components/admin/auth/AuthSplit';
import { resetPasswordAction } from '@/server/auth/actions';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{ newPassword?: string; confirmPassword?: string }>(
    {}
  );
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(
        'Password reset token is missing from the URL. Please use the complete recovery link from your email.'
      );
      return;
    }

    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword || newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await resetPasswordAction({
        token,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        setError(result.error || 'Password reset failed. Link may be expired or already used.');
        setIsLoading(false);
        return;
      }

      setSuccess(
        'Your password has been successfully updated. Existing sessions have been revoked.'
      );
      setTimeout(() => {
        router.push('/admin/login');
      }, 2500);
    } catch {
      setError('Connection error. Unable to contact the authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplit
      panelTitle="Set a password you can trust."
      panelText="Choose a new administrator password. Existing sessions are signed out after the change."
      title="Choose a new password"
      description="Enter and confirm your new administrator password."
    >
      {!token && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="leading-relaxed">
            No reset token detected in the URL. Open the complete link from your email.
          </div>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="leading-relaxed">
            <strong className="mb-0.5 block font-semibold">Password updated</strong>
            {success}
            <span className="mt-1 block text-[11px] text-emerald-700">
              Redirecting to sign-in...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-accent">New password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={`h-11 bg-white pr-10 text-sm ${errors.newPassword ? 'border-rose-400' : ''}`}
              autoComplete="new-password"
              disabled={isLoading || Boolean(success)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-accent">Confirm password</label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className={`h-11 bg-white text-sm ${errors.confirmPassword ? 'border-rose-400' : ''}`}
            autoComplete="new-password"
            disabled={isLoading || Boolean(success)}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !token || Boolean(success)}
          className={authSubmitClass}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Updating...' : 'Save password'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/admin/login" className="font-medium text-primary">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthSplit>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center gap-2 bg-[#eef1f0] text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading recovery link...
        </div>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  );
}
