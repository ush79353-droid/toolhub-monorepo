import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Shield, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Omega Calculators',
  description:
    'Learn how Omega Calculators handles privacy, in-browser data processing, cookies, and local execution in this draft privacy policy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container className="max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} className="mb-6" />

        {/* Heading */}
        <div className="border-b border-border pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Last Updated: November 11, 2026 •{' '}
            <em>Draft template pending formal legal counsel review</em>
          </p>
        </div>

        {/* Legal Notice Disclaimer Banner */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Draft Notice:</strong> This privacy document is a development template outlining
            the intended architectural privacy model of Omega Calculators. It must undergo formal legal
            audit before production deployment.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Table of Contents (Sticky on Desktop) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-xs text-muted-foreground">
                <a href="#overview" className="block hover:text-primary transition-colors">
                  1. Overview & Architecture
                </a>
                <a href="#client-processing" className="block hover:text-primary transition-colors">
                  2. In-Browser Client Processing
                </a>
                <a
                  href="#information-collected"
                  className="block hover:text-primary transition-colors"
                >
                  3. Information We Collect
                </a>
                <a href="#cookies" className="block hover:text-primary transition-colors">
                  4. Cookies & Local Storage
                </a>
                <a href="#third-parties" className="block hover:text-primary transition-colors">
                  5. Third-Party Services
                </a>
                <a href="#updates" className="block hover:text-primary transition-colors">
                  6. Policy Revisions
                </a>
                <a href="#contact" className="block hover:text-primary transition-colors">
                  7. Inquiries
                </a>
              </nav>
            </div>
          </aside>

          {/* Legal Document Content */}
          <div className="lg:col-span-8 prose prose-slate max-w-none text-sm leading-relaxed text-muted-foreground space-y-8">
            <section
              id="overview"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">1. Overview & Architecture</h2>
              <p className="mt-3">
                Omega Calculators (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is engineered around
                a client-first paradigm. Unlike traditional online utility portals that transmit
                your sensitive financial, health, or document inputs to remote web servers, our
                tools are structured to execute computations directly inside the client&apos;s local
                browser runtime environment whenever technically feasible.
              </p>
            </section>

            <section
              id="client-processing"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">2. In-Browser Client Processing</h2>
              <p className="mt-3">
                Tools labeled as &quot;Client-Side&quot; (such as Age Calculator, BMI Calculator,
                Percentage Calculator, JSON Formatter, and Unit Converters) utilize your
                device&apos;s JavaScript engine.
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  Input values are computed in active browser memory and discarded upon page
                  refresh.
                </li>
                <li>
                  No database records, server logs, or telemetry are created from client
                  calculations.
                </li>
                <li>
                  Document files processed in client mode are not transmitted over the internet.
                </li>
              </ul>
            </section>

            <section
              id="information-collected"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">3. Information We Collect</h2>
              <p className="mt-3">
                When you visit our platform, standard non-identifying technical metadata may be
                logged for basic network diagnostics, including:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Date and time of site access</li>
                <li>Referring website URLs</li>
              </ul>
              <p className="mt-3">
                We do not require account registration, email addresses, or payment card details to
                access public utilities.
              </p>
            </section>

            <section
              id="cookies"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">4. Cookies & Local Storage</h2>
              <p className="mt-3">
                We may utilize browser local storage to preserve non-critical user preferences (such
                as your preferred measurement units, dark/light theme, or recently visited tools
                list). You may clear this data at any time through your browser settings.
              </p>
            </section>

            <section
              id="third-parties"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">5. Third-Party Services</h2>
              <p className="mt-3">
                Our web hosting infrastructure may utilize standard Content Delivery Networks (CDNs)
                to securely deliver static assets, stylesheet bundles, and application scripts.
              </p>
            </section>

            <section
              id="updates"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">6. Policy Revisions</h2>
              <p className="mt-3">
                We reserve the right to revise this draft Privacy Policy as new backend-supported
                utilities or storage features are released. Revisions will be dated at the top of
                this document.
              </p>
            </section>

            <section
              id="contact"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">7. Inquiries</h2>
              <p className="mt-3">
                If you have questions regarding this privacy architecture or wish to share feedback
                on our data handling practices, please reach out via our{' '}
                <Link href="/contact" className="font-semibold text-primary underline">
                  Contact Form
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
