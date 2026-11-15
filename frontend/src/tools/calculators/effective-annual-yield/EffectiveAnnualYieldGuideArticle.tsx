import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EFFECTIVE_ANNUAL_YIELD_FAQS } from './content';

export function EffectiveAnnualYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-effective-annual-yield"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Effective Annual Yield?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Effective annual yield expresses a nominal coupon rate as a true yearly return when coupons
        are assumed to compound at the periodic coupon rate. This tool does not solve bond yield to
        maturity from market price.
      </p>

      <h2
        id="effective-annual-yield-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Annual Yield Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Coupon Rate (%) = (Annual Coupon Payment / Face Value) × 100</p>
        <p className="mt-2">Effective Annual Yield (%) = [(1 + r / n)^n − 1] × 100</p>
        <p className="mt-2">r = Coupon Rate / 100 · n = payments per year</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Face value = PKR 10,000</p>
        <p>Annual coupon payment = PKR 800</p>
        <p>Coupon rate = (800 / 10,000) × 100 = 8%</p>
        <p>Frequency = Semiannually (n = 2)</p>
        <p>Effective annual yield = (1 + 0.08/2)^2 − 1 = 8.16%</p>
      </div>

      <h2
        id="effective-annual-yield-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EFFECTIVE_ANNUAL_YIELD_FAQS]} />
      </div>
    </article>
  );
}
