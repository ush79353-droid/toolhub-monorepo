import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ROI_FAQS } from './content';

export function RoiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-roi" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is ROI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Return on investment (ROI) measures gain or loss relative to the money put in. This
        calculator reports simple ROI for the full holding period and an annualized ROI based on
        calendar dates, with optional recurring contributions.
      </p>

      <h2 id="roi-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total Investment = Initial Investment + Total Contributions</p>
        <p>Total Gain/Loss = Returned Amount − Total Investment</p>
        <p>ROI (%) = (Total Gain/Loss ÷ Total Investment) × 100</p>
        <p>No contributions: Returned = Initial × (1 + r)^t</p>
        <p>Annualized (lump sum): [(Returned ÷ Initial)^(1 ÷ Years) − 1] × 100</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial investment = PKR 10,000</p>
        <p>Returned amount = PKR 15,000</p>
        <p>Investment period = 5 years · no contributions</p>
        <p>Total gain = 15,000 − 10,000 = PKR 5,000</p>
        <p>ROI = 5,000 ÷ 10,000 × 100 = 50%</p>
        <p>Annualized ROI ≈ 8.447%</p>
      </div>

      <h2 id="roi-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ROI_FAQS]} />
      </div>
    </article>
  );
}
