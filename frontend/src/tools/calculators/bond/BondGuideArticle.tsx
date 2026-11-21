import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOND_FAQS } from './content';

export function BondGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bond-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price a coupon bond at a coupon date, or solve for face value, yield, time to maturity,
        or annual coupon when the other inputs are known. Leave exactly one variable blank.
        Amounts are shown in USD. Accrued interest between coupon dates is not included.
      </p>

      <h2
        id="bond-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>m = coupon payments per year</p>
        <p>N = years × m (whole number of periods)</p>
        <p>C = annual coupon ÷ m (or (rate% × face) ÷ m)</p>
        <p>r = annual yield ÷ m</p>
        <p>P = Σₜ₌₁ᴺ C / (1+r)ᵗ + F / (1+r)ᴺ</p>
        <p>Zero yield: P = C·N + F</p>
        <p>Zero coupon: y = m · ((F/P)^(1/N) − 1)</p>
        <p>Other unknowns use the same equation with algebraic or numerical root-finding</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Face $100 · Yield 6% · Maturity 3 years · Annual coupon 5% · Annually</p>
        <p>C = 5 · r = 0.06 · N = 3</p>
        <p>P = 5/1.06 + 5/1.06² + 5/1.06³ + 100/1.06³ ≈ $97.3270</p>
      </div>

      <h2
        id="bond-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOND_FAQS]} />
      </div>
    </article>
  );
}
