import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MUTUAL_FUND_FAQS } from './content';

export function MutualFundGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mutual-fund-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Mutual Fund Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates how much a mutual fund investment may be worth at maturity. Choose
        a Systematic Investment Plan (SIP) with monthly contributions or a one-time lump sum, enter
        an expected annual return, and set the investment period in years and months. Projected
        returns are estimates, not guaranteed investment outcomes.
      </p>

      <h2
        id="mutual-fund-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = Expected Annual Return / 12</p>
        <p>n = Years × 12 + Months</p>
        <p className="mt-2">SIP: Maturity = P × [((1 + i)^n − 1) / i]</p>
        <p>SIP when i = 0: Maturity = P × n</p>
        <p className="mt-2">Lump sum: Maturity = P × (1 + i)^n</p>
        <p>Lump sum when i = 0: Maturity = P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly SIP = PKR 1,000</p>
        <p>Expected annual return = 12%</p>
        <p>Investment period = 1 year (n = 12)</p>
        <p>i = 0.12 / 12 = 0.01</p>
        <p>Maturity ≈ PKR 12,682.50</p>
      </div>

      <h2
        id="mutual-fund-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MUTUAL_FUND_FAQS]} />
      </div>
    </article>
  );
}
