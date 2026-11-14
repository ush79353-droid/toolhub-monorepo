import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CPC_CPM_FAQS } from './content';

export function CpcAndCpmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-cpc-cpm-mean"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What CPC and CPM Mean
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CPC (cost per click) and CPM (cost per mille) are common digital advertising cost metrics.
        This calculator also links them to impressions, click-through rate, clicks, and total spend so
        you can fill in what you know and solve for what is missing.
      </p>

      <h2 id="formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-1 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Clicks = Impressions × CTR / 100</p>
        <p>CTR (%) = Clicks / Impressions × 100</p>
        <p>Total Cost = Clicks × CPC</p>
        <p>CPC = Total Cost / Clicks</p>
        <p>CPM = Total Cost / Impressions × 1000</p>
        <p>Total Cost = CPM × Impressions / 1000</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Impressions = 10,000 · CPC = 20 · CTR = 5%</p>
        <p>Clicks = 10,000 × 5 / 100 = 500</p>
        <p>Total cost = 500 × 20 = 10,000</p>
        <p>CPM = 10,000 / 10,000 × 1,000 = 1,000</p>
      </div>

      <h2 id="cpc-cpm-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CPC_CPM_FAQS]} />
      </div>
    </article>
  );
}
