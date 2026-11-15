import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ADSENSE_FAQS } from './content';

export function GoogleAdsenseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-adsense-estimate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate daily Google AdSense performance from pageviews, ads per page, click-through rate,
        and cost per click. Incomplete stages stay blank until their inputs are valid.
      </p>

      <h2
        id="adsense-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Ad Impressions = Pageviews × Ads per Page</p>
        <p>Number of Clicks = Ad Impressions × (CTR / 100)</p>
        <p>Google AdSense Revenue = Number of Clicks × CPC</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Pageviews = 10,000 / day</p>
        <p>Ads per page = 2</p>
        <p>CTR = 2%</p>
        <p>CPC = PKR 15</p>
        <p>Ad impressions = 20,000 / day</p>
        <p>Clicks = 400 / day</p>
        <p>AdSense revenue = PKR 6,000 / day</p>
      </div>

      <h2 id="adsense-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ADSENSE_FAQS]} />
      </div>
    </article>
  );
}
