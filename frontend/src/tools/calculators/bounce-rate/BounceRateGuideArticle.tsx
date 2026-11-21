import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOUNCE_RATE_FAQS } from './content';

export function BounceRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-bounce-rate" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Bounce Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bounce rate measures how often visitors land on your site, view a single page, and leave without
        continuing to another page. Marketers and site owners use it as a quick signal of engagement,
 content relevance, and landing-page clarity, though it should always be interpreted alongside
        goals, traffic sources, and conversion data.
      </p>

      <h2 id="formula-and-calculation" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Bounce Rate Formula
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The standard calculation divides one-page visits by total website visits:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Bounce Rate (%) = (One-page Visits / Total Website Visits) × 100</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total visits must be greater than zero. One-page visits may be zero (0% bounce rate) but cannot
        exceed total visits.
      </p>

      <h2 id="step-by-step-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Step-by-Step Example
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose your analytics report shows:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Number of website visits:</strong> 1,000
        </li>
        <li>
          <strong>Number of one-page visits:</strong> 350
        </li>
      </ul>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>1. Bounce Rate = (350 / 1,000) × 100</p>
        <p>2. Bounce Rate = 0.35 × 100</p>
        <p>
          3. <strong>Final Result: 35%</strong>
        </p>
      </div>

      <h2
        id="what-is-a-good-bounce-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Bounce Rate?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Benchmarks vary widely by industry and page type. Many content and e-commerce sites aim for
        rates roughly in the 40–60% range, while single-page landing pages or blog articles can run
        higher without indicating failure. Compare against your own historical baseline and similar
        pages before treating any single percentage as “good” or “bad.”
      </p>

      <h2
        id="how-to-lower-bounce-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Lower Bounce Rate
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Match intent:</strong> Align headlines and offers with the ads or search queries that
          bring visitors in.
        </li>
        <li>
          <strong>Improve speed and mobile layout:</strong> Slow or hard-to-use pages drive early exits.
        </li>
        <li>
          <strong>Add clear next steps:</strong> Internal links, related posts, and CTAs encourage a
          second page view when it supports the visitor’s goal.
        </li>
        <li>
          <strong>Fix broken paths:</strong> Remove dead ends, confusing navigation, and misleading
          thumbnails.
        </li>
      </ul>

      <h2 id="bounce-rate-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOUNCE_RATE_FAQS]} />
      </div>
    </article>
  );
}
