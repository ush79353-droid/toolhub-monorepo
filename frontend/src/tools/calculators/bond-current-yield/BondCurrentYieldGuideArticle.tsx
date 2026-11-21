import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOND_CURRENT_YIELD_FAQS } from './content';

export function BondCurrentYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-current-yield"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Bond Current Yield?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current yield measures the annual coupon income a bond pays relative to its
        market price. From face value, coupon rate, and payment frequency, this
        calculator reports the annual coupon, the coupon per period, and current
        yield. It is not yield to maturity.
      </p>

      <h2
        id="current-yield-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Yield Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Coupon = Face Value × Coupon Rate / 100</p>
        <p className="mt-2">Coupon Per Period = Annual Coupon / Payments Per Year</p>
        <p className="mt-2">Current Yield (%) = Annual Coupon / Bond Price × 100</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Payments per year: Annually 1 · Semiannually 2 · Quarterly 4 · Monthly 12
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Face value = 1,000 PKR · Coupon rate = 5% · Frequency = Annually</p>
        <p>Annual coupon = 1,000 × 0.05 = 50 PKR</p>
        <p>Coupon per period = 50 / 1 = 50 PKR</p>
        <p>Bond price = 980 PKR → Current yield = 50 / 980 × 100 ≈ 5.102%</p>
      </div>

      <h2
        id="bond-current-yield-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOND_CURRENT_YIELD_FAQS]} />
      </div>
    </article>
  );
}
