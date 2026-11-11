'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPasswordAction } from '@/server/auth/actions';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPasswordAction({ email });

      if (!result.success) {
        setError(result.error || 'Failed to dispatch password reset request.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        result.data?.message ||
          'If an active administrator account exists for this email, password reset instructions have been dispatched.'
      );
      setEmail('');
    } catch {
      setError('Connection error. Ensure the backend server is reachable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-white to-background">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center">
            <img
              src="/images/logo/horizontal-logo.png"
              alt="Omega Calculators"
              className="h-16 w-auto"
            />
            <span className="mt-3 text-xs font-semibold tracking-wider text-primary uppercase">
              Admin Console
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-accent">
            Reset Password
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter your administrator email to receive single-use recovery instructions.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-lg">
          {successMessage && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-relaxed">
                <strong className="font-semibold block mb-0.5">Instructions Dispatched:</strong>
                {successMessage}
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
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Admin Account Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@megatools.io"
                  className="pl-9 text-xs"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="default"
              disabled={isLoading}
              className="w-full bg-primary text-white hover:bg-[hsl(var(--primary-hover))] text-xs font-semibold h-10 mt-2 inline-flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isLoading ? 'Processing Request...' : 'Send Recovery Instructions'}</span>
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <Link
              href="/admin/login"
              className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Console Sign In</span>
            </Link>
          </div>
        </div>

        {/* Public Site Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
