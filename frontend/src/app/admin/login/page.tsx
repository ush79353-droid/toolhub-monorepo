'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotice(null);
      return;
    }

    setErrors({});
    setNotice(
      'Authentication integration pending: In this UI phase, credentials are not sent over the wire and no session tokens are stored in the browser. You may explore the development dashboard preview below.'
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-white to-background">
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
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-accent">Welcome Back</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to access platform administration, tool registries, and analytics.
          </p>
        </div>

        {/* Security Boundary Notice */}
        <div className="mb-6 rounded-xl border border-teal-200 bg-secondary/50 p-4 text-xs text-primary shadow-xs">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold block mb-0.5">Development UI Preview Mode:</strong>
              This phase implements frontend UI/UX components only. Production authentication with
              JWT & HTTP-only cookies on the Express backend will be wired in the security phase.
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-lg">
          {notice && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div className="leading-relaxed">{notice}</div>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                />
                <span>Remember this device</span>
              </label>

              <span className="text-[11px] text-muted-foreground cursor-not-allowed">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              size="default"
              className="w-full bg-primary text-white hover:bg-[hsl(var(--primary-hover))] text-xs font-semibold h-10 mt-2"
            >
              Sign In to Console
            </Button>
          </form>

          {/* Quick Preview Shortcut */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin')}
              className="w-full inline-flex items-center justify-center gap-2 text-xs border-teal-200 text-primary hover:bg-secondary"
            >
              <span>Explore Dashboard Preview (UI Mode)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
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
