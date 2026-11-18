import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VA_MORTGAGE_FAQS } from './content';

export function VaMortgageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-va-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a VA Mortgage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A VA-backed purchase loan helps eligible service members, Veterans, and qualifying
        surviving spouses finance a home. This calculator estimates the monthly principal and
        interest payment from home price, down payment, term, rate, and the published VA funding
        fee rules.
      </p>

      <h2
        id="va-funding-fee"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        VA Funding Fee
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Base loan = Home price − Down payment</p>
        <p>First use &lt;5% down → 2.15% · 5%+ → 1.50% · 10%+ → 1.25%</p>
        <p>Subsequent use &lt;5% down → 3.30% · 5%+ → 1.50% · 10%+ → 1.25%</p>
        <p>Disability 10%+ or surviving spouse → funding fee exempt (0%)</p>
        <p>Financed: Principal = Base + Fee · Upfront: Principal = Base</p>
        <p>Monthly = P × r / (1 − (1+r)^(−n)) with r = APR/1200, n = years×12</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home $500,000 · 0% down · 30 years · 7.319% · first use · no disability</p>
        <p>Funding fee 2.15% × $500,000 = $10,750 (financed)</p>
        <p>Loan amount = $510,750</p>
        <p>Monthly pay ≈ $3,508.15 · Total payments ≈ $1,262,934.28 · Interest ≈ $752,184.28</p>
      </div>

      <h2
        id="va-mortgage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...VA_MORTGAGE_FAQS]} />
      </div>
    </article>
  );
}
