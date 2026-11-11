import * as React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface AuthSplitProps {
  panelTitle: string;
  panelText: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const authSubmitClass =
  'h-11 w-full rounded-lg bg-gradient-to-r from-primary-hover to-[#149eab] text-sm font-semibold text-white shadow-md shadow-primary/25 hover:brightness-[1.03]';

export function AuthSplit({ panelTitle, panelText, title, description, children }: AuthSplitProps) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f0] p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-28px_rgba(22,60,67,0.45)] lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2] p-8 lg:flex">
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="pointer-events-none absolute bottom-28 right-8 h-36 w-36 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />

          <Link
            href="/"
            className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur"
          >
            <img src="/images/logo/icon-with-bg.png" alt="" className="h-6 w-6 rounded-md" />
            <span className="text-sm font-semibold text-accent">Omega Calculators</span>
          </Link>

          <div className="relative z-10 max-w-sm pb-4">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-accent">
              {panelTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{panelText}</p>
          </div>
        </aside>

        <section className="relative flex flex-col px-6 py-8 sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(to right, hsl(174 15% 88% / 0.85) 1px, transparent 1px), linear-gradient(to bottom, hsl(174 15% 88% / 0.85) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 72%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 72%)',
            }}
          />

          <div className="relative z-10 flex flex-1 flex-col">
            <img
              src="/images/logo/icon-with-bg.png"
              alt="Omega Calculators"
              className="h-12 w-12 rounded-2xl"
            />
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Administration Portal
            </p>
            <h1 className="mt-2 text-[1.65rem] font-bold tracking-tight text-accent">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

            <div className="mt-6">{children}</div>

            <div className="mt-auto flex items-center justify-between gap-3 pt-8 text-[11px] text-muted-foreground">
              <p>© {year} Omega Calculators</p>
              <p className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Secure administration access
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
