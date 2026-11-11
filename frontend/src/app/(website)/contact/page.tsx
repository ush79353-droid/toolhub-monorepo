import * as React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ContactFormClient } from '@/components/contact/ContactFormClient';
import { MessageSquare, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us — Inquiries & Tool Suggestions',
  description:
    'Get in touch with the Omega Calculators team. Share feedback, suggest new calculators, or report utility issues.',
};

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container className="max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'Contact Us' }]} className="mb-6" />

        {/* Heading */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Feedback & Inquiries
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            Contact Omega Calculators
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Have an idea for a new calculator or converter? Found an edge case formula error? We
            welcome your thoughts and suggestions.
          </p>
        </div>

        {/* Form and Side Info Cards */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8">
            <ContactFormClient />
          </div>

          {/* Side Info Panels (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-accent">Feature Requests</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                We prioritize new tools based on community requests. Describe the formulas or
                workflow you need and we will look into adding it.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-accent">Bug Reports</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                If a calculation produces an unexpected result or a converter misses a specific
                unit, please include the test values so we can reproduce it.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
