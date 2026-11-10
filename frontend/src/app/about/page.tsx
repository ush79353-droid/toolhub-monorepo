import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, Target, ArrowRight, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Mega Tools Online Utilities Platform',
  description:
    'Learn about Mega Tools: our mission, our privacy-first browser execution architecture, and our commitment to fast, free utilities.',
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container className="max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'About Us' }]} className="mb-6" />

        {/* Hero / Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Our Story & Mission</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-accent sm:text-4xl lg:text-5xl">
            Empowering Daily Productivity with Fast, Clean Tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Mega Tools is an open web platform created to eliminate clunky, ad-saturated calculation
            websites in favor of fast, responsive, and privacy-conscious utilities.
          </p>
        </div>

        {/* Mission Card */}
        <div className="mt-12 rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-accent">Our Mission</h2>
              <p className="text-xs text-muted-foreground">Why we build Mega Tools</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every day, millions of people search for simple tasks: calculating mortgage
            amortizations, converting units of measurement, formatting an API JSON payload, or
            compressing an image. Too often, existing sites are slow, covered with aggressive
            popups, and transmit private data to unverified backends.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Our goal is simple: deliver a dependable, high-performance home for all your daily
            utilities, built with modern web standards and respect for your time and privacy.
          </p>
        </div>

        {/* What We Build */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-accent text-center sm:text-left">What We Build</h2>
          <p className="mt-1 text-sm text-muted-foreground text-center sm:text-left">
            Our growing platform spans several distinct utility categories:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-foreground">Calculators</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Financial, health, age, and percentage calculators with live instant results.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-foreground">Unit Converters</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Universal measurement conversions spanning length, mass, temperature, and currency.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-foreground">Developer Utilities</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                JSON formatters, Base64 codecs, UUID generators, and regex inspectors for software
                engineers.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-foreground">Document & Image Tools</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                In-browser image compressors, converters, PDF organizers, and aspect ratio solvers.
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach (Principles) */}
        <div className="mt-14 rounded-2xl border border-border bg-muted/40 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-accent">Our Architectural Approach</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We adhere to four core engineering principles across every tool we publish:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Client-First Privacy</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Whenever technically feasible, tools run entirely inside your browser sandbox so
                  your data never touches a server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Zero Latency Speed</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  No loading spinners or network lag for arithmetic tasks. Results calculate
                  instantaneously as you type.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Accessible & Responsive</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Built to WCAG standards with high contrast ratios, touch-friendly tap targets, and
                  full mobile fluidity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Honest Architecture</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  No misleading claims, hidden paywalls, or deceptive download triggers. Clean
                  utilities you can trust.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-14 text-center">
          <h3 className="text-xl font-bold text-accent">Ready to Get Started?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore our collection or check out our most popular calculators.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="default"
              className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))]"
            >
              <Link href="/tools" className="inline-flex items-center gap-2">
                <span>Explore All Tools</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
