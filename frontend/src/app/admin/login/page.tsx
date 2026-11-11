'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAdminAction } from '@/server/auth/actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await loginAdminAction({
        email,
        password,
        rememberMe,
      });

      if (!result.success) {
        setAuthError(result.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Successful login -> Navigate to Admin Dashboard
      router.push('/admin');
      router.refresh();
    } catch {
      setAuthError('Connection error. Ensure the Express backend server is running.');
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
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-accent">Welcome Back</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to access platform administration, tool registries, and analytics.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-lg">
          {authError && (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed">{authError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@megatools.io"
                  className={`pl-9 text-xs ${errors.email ? 'border-rose-400' : ''}`}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent mb-1.5">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`pl-9 pr-9 text-xs ${errors.password ? 'border-rose-400' : ''}`}
                  autoComplete="current-password"
                  disabled={isLoading}
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
              {errors.password && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  disabled={isLoading}
                />
                <span>Remember this device (7 days)</span>
              </label>

              <Link
                href="/admin/forgot-password"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="default"
              disabled={isLoading}
              className="w-full bg-primary text-white hover:bg-[hsl(var(--primary-hover))] text-xs font-semibold h-10 mt-2 inline-flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Console'}</span>
            </Button>
          </form>
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
