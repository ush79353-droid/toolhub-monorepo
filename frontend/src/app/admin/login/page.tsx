'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthSplit, authSubmitClass } from '@/components/admin/auth/AuthSplit';
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
    <AuthSplit
      panelTitle="Manage your calculator platform with clarity."
      panelText="A secure administration space for tools, categories, and platform settings."
      title="Log in to your account"
      description="Welcome back! Please enter your details."
    >
      {authError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div className="leading-relaxed">{authError}</div>
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
            className={`h-11 bg-white text-sm ${errors.email ? 'border-rose-400' : ''}`}
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-[11px] text-rose-600">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-accent">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`h-11 bg-white pr-10 text-sm ${errors.password ? 'border-rose-400' : ''}`}
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
          {errors.password && <p className="mt-1 text-[11px] text-rose-600">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
              disabled={isLoading}
            />
            <span>Remember for 7 days</span>
          </label>
          <Link href="/admin/forgot-password" className="text-sm font-medium text-primary">
            Forgot password
          </Link>
        </div>

        <Button type="submit" disabled={isLoading} className={authSubmitClass}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Verifying...' : 'Sign In'}
        </Button>
      </form>
    </AuthSplit>
  );
}
