'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthSplit, authSubmitClass } from '@/components/admin/auth/AuthSplit';
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
    <AuthSplit
      panelTitle="Recover access in a single step."
      panelText="Enter the email on your administrator account and we'll send a one-time reset link."
      title="Reset your password"
      description="We'll email recovery instructions if this address belongs to an administrator."
    >
      {successMessage && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="leading-relaxed">
            <strong className="mb-0.5 block font-semibold">Instructions sent</strong>
            {successMessage}
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
          <label className="mb-1.5 block text-sm font-medium text-accent">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@omegacalculators.com"
            className="h-11 bg-white text-sm"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading} className={authSubmitClass}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Sending...' : 'Send reset link'}
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
