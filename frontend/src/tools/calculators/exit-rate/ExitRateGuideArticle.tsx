import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EXIT_RATE_FAQS } from './content';

export function ExitRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-exit-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Exit Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Exit rate shows how often a page was the last page viewed in a session. Analysts use it to
        spot pages where visitors leave after viewing that page.
      </p>

      <h2
        id="exit-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Exit Rate Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Exit Rate (%) = (Number of Exits / Number of Pageviews) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Number of pageviews = 1,000</p>
        <p>Number of exits = 250</p>
        <p>Exit rate = (250 / 1,000) × 100 = 25%</p>
      </div>

      <h2 id="exit-rate-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EXIT_RATE_FAQS]} />
      </div>
    </article>
  );
}
