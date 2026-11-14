import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PVGO_FAQS } from './content';

export function PvgoGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-pvgo" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is PVGO?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Present value of growth opportunities (PVGO) separates a stock’s price into the value of
        current earnings capitalized at the cost of equity and the extra value the market assigns to
        expected growth.
      </p>

      <h2 id="pvgo-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EPS = Earnings / Number of Shares Outstanding</p>
        <p>PVGO = Share Price − (EPS / (Cost of Equity / 100))</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Earnings = PKR 1,000,000</p>
        <p>Shares outstanding = 100,000 → EPS = PKR 10</p>
        <p>Share price = PKR 150</p>
        <p>Cost of equity = 10%</p>
        <p>PVGO = 150 − (10 / 0.10) = PKR 50 per share</p>
      </div>

      <h2 id="pvgo-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PVGO_FAQS]} />
      </div>
    </article>
  );
}
