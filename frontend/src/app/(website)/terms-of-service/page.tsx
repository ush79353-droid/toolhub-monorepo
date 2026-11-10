import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { AlertCircle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — Mega Tools',
  description:
    'Review the terms, conditions, and disclaimers governing the use of Mega Tools calculators and utilities.',
};

export default function TermsOfServicePage() {
  return (
    <div className="py-8 sm:py-16">
      <Container className="max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} className="mb-6" />

        {/* Heading */}
        <div className="border-b border-border pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Scale className="h-3.5 w-3.5 text-primary" />
            <span>Terms & Conditions</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Last Updated: November 11, 2026 •{' '}
            <em>Draft template pending formal legal counsel review</em>
          </p>
        </div>

        {/* Legal Disclaimer Banner */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Draft Notice:</strong> This document is a development template outlining usage
            conditions for the Mega Tools website. It must undergo formal legal audit before
            production deployment.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Table of Contents */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-xs text-muted-foreground">
                <a href="#acceptance" className="block hover:text-primary transition-colors">
                  1. Acceptance of Terms
                </a>
                <a href="#nature-of-tools" className="block hover:text-primary transition-colors">
                  2. Nature of Utilities
                </a>
                <a href="#user-conduct" className="block hover:text-primary transition-colors">
                  3. Permitted Use
                </a>
                <a
                  href="#intellectual-property"
                  className="block hover:text-primary transition-colors"
                >
                  4. Intellectual Property
                </a>
                <a href="#disclaimers" className="block hover:text-primary transition-colors">
                  5. Disclaimer of Warranties
                </a>
                <a href="#liability" className="block hover:text-primary transition-colors">
                  6. Limitation of Liability
                </a>
                <a href="#contact" className="block hover:text-primary transition-colors">
                  7. Inquiries
                </a>
              </nav>
            </div>
          </aside>

          {/* Terms Content */}
          <div className="lg:col-span-8 prose prose-slate max-w-none text-sm leading-relaxed text-muted-foreground space-y-8">
            <section
              id="acceptance"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">1. Acceptance of Terms</h2>
              <p className="mt-3">
                By accessing or using the Mega Tools website, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service. If you disagree with
                any portion of these terms, you should discontinue use of the platform immediately.
              </p>
            </section>

            <section
              id="nature-of-tools"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">
                2. Nature of Utilities & No Professional Advice
              </h2>
              <p className="mt-3">
                All calculations, unit conversions, financial estimations, and health figures (such
                as BMI, loan amortizations, or percentage calculations) provided on Mega Tools are
                offered solely for general informational and educational purposes.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-accent font-semibold">
                None of the outputs generated by our tools constitute certified financial, legal,
                medical, or engineering advice. You should always consult with qualified
                professionals prior to making binding financial commitments or health decisions.
              </p>
            </section>

            <section
              id="user-conduct"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">3. Permitted Use</h2>
              <p className="mt-3">
                You agree to use Mega Tools only for lawful purposes. You must not attempt to
                disrupt the operation of the website, reverse engineer uncompiled code, probe system
                vulnerabilities, or execute automated scraping that degrades server performance for
                other visitors.
              </p>
            </section>

            <section
              id="intellectual-property"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">4. Intellectual Property</h2>
              <p className="mt-3">
                All branding, interface designs, icons, typography systems, and original software
                algorithms comprising Mega Tools are the property of Mega Tools or its licensors and
                are protected under applicable copyright and intellectual property legislation.
              </p>
            </section>

            <section
              id="disclaimers"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">5. Disclaimer of Warranties</h2>
              <p className="mt-3">
                The tools and services on this site are provided on an &quot;AS IS&quot; and
                &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or
                implied, including but not limited to the implied warranties of merchantability,
                fitness for a particular purpose, or error-free computation.
              </p>
            </section>

            <section
              id="liability"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">6. Limitation of Liability</h2>
              <p className="mt-3">
                Under no circumstances shall Mega Tools, its contributors, or its operators be held
                liable for any direct, indirect, incidental, special, or consequential damages
                resulting from the use of, or the inability to use, any tool or computation provided
                on this platform.
              </p>
            </section>

            <section
              id="contact"
              className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-lg font-bold text-accent">7. Inquiries</h2>
              <p className="mt-3">
                For questions regarding these terms, please contact us via our{' '}
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
