import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EFFECTIVE_CORPORATE_TAX_RATE_FAQS } from './content';

export function EffectiveCorporateTaxRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-effective-corporate-tax-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Effective Corporate Tax Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The effective corporate tax rate measures how much income tax a company paid relative to its
        earnings before tax. Analysts use it to compare tax burden across periods or firms when
        statutory rates, credits, and timing differences make the headline rate incomplete.
      </p>

      <h2
        id="effective-tax-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Effective Corporate Tax Rate (%) = (Income Tax Paid ÷ Earnings Before Tax) × 100
      </div>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter earnings before tax (must be greater than zero).</li>
        <li>Enter income tax paid (zero allowed; negatives rejected).</li>
        <li>The effective rate updates automatically when both inputs are valid.</li>
      </ol>

      <h2
        id="effective-tax-rate-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Earnings before tax = 1,000,000</p>
        <p>Income tax paid = 250,000</p>
        <p>Effective corporate tax rate = (250,000 ÷ 1,000,000) × 100 = 25%</p>
      </div>

      <h2
        id="effective-tax-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={EFFECTIVE_CORPORATE_TAX_RATE_FAQS} />
      </div>
    </article>
  );
}
