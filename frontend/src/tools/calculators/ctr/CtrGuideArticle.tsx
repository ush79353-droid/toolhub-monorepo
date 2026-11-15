import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CTR_FAQS } from './content';

export function CtrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-ctr" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is CTR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Click-through rate (CTR) measures how often people click an ad after seeing it. Marketers use
        it to compare creative, placements, and campaigns.
      </p>

      <h2 id="ctr-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        CTR Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CTR (%) = (Number of Clicks / Ad Impressions) × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Ad impressions = 10,000</p>
        <p>Number of clicks = 250</p>
        <p>CTR = (250 / 10,000) × 100 = 2.5%</p>
      </div>

      <h2 id="ctr-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CTR_FAQS]} />
      </div>
    </article>
  );
}
