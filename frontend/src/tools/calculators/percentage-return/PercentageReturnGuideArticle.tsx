import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PERCENTAGE_RETURN_FAQS } from './content';

export function PercentageReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-percentage-return"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Percentage Return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percentage return measures how much an investment gained or lost relative to the amount put
        in. Annualizing that result converts the holding-period return into a compound yearly rate
        so investments of different lengths can be compared.
      </p>

      <h2
        id="percentage-return-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gain/Loss = Returned Amount − Invested Amount</p>
        <p>Percentage Return (%) = ((Returned − Invested) / Invested) × 100</p>
        <p>Annualized Return (%) = ((Returned / Invested)^(1 / Years) − 1) × 100</p>
        <p>Years (time needed) = ln(Returned / Invested) / ln(1 + Annualized Rate)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Invested = PKR 10,000</p>
        <p>Returned = PKR 12,100</p>
        <p>Duration = 2 years</p>
        <p>Gain = 12,100 − 10,000 = PKR 2,100</p>
        <p>Percentage return = 2,100 / 10,000 × 100 = 21%</p>
        <p>Annualized return = (12,100 / 10,000)^(1/2) − 1 = 10%</p>
      </div>

      <h2
        id="percentage-return-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PERCENTAGE_RETURN_FAQS]} />
      </div>
    </article>
  );
}
