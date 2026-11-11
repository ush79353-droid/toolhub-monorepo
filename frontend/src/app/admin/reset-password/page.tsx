'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div className="text-left">
            <span className="text-xl font-extrabold tracking-tight text-accent block">
              MEGA TOOLS
            </span>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Admin Console
            </span>
          </div>
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-accent">
          Choose New Password
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter and confirm your new administrator password.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-lg">
        {!token && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="leading-relaxed">
              No reset token detected in the URL. If you requested a reset link, please click the
              link provided in your email.
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
            <div className="leading-relaxed">
              <strong className="font-semibold block mb-0.5">Password Reset Complete:</strong>
              {success}
              <span className="block mt-1 text-[11px] text-emerald-700">
                Redirecting to sign-in page...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`pl-9 pr-9 text-xs ${errors.newPassword ? 'border-rose-400' : ''}`}
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
              <p className="text-[11px] text-rose-600 mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`pl-9 text-xs ${errors.confirmPassword ? 'border-rose-400' : ''}`}
                autoComplete="new-password"
                disabled={isLoading || Boolean(success)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            size="default"
            disabled={isLoading || !token || Boolean(success)}
            className="w-full bg-primary text-white hover:bg-[hsl(var(--primary-hover))] text-xs font-semibold h-10 mt-2 inline-flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isLoading ? 'Updating Password...' : 'Save New Password'}</span>
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border text-center">
          <Link
            href="/admin/login"
            className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-white to-background">
      <React.Suspense
        fallback={
          <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading recovery parameters...</span>
          </div>
        }
      >
        <ResetPasswordForm />
      </React.Suspense>
    </div>
  );
}
