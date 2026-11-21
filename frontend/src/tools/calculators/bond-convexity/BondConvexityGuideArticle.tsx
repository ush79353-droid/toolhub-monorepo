import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOND_CONVEXITY_FAQS } from './content';

export function BondConvexityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bond-convexity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Bond Convexity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bond convexity measures how a bond&apos;s price curves as yield changes. Duration is a
        linear approximation; convexity captures the second-order bend. This calculator first
        derives coupon cash flows and the flat bond price at the entered yield to maturity, then
        estimates convexity with a centered finite difference around that yield.
      </p>

      <h2
        id="bond-convexity-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Bond Convexity Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Coupon Per Period = Face Value × Annual Coupon Rate / Payments Per Year</p>
        <p className="mt-2">Annual Coupon = Face Value × Annual Coupon Rate</p>
        <p className="mt-2">
          Bond Price = Σ Coupons / (1 + y/m)^k + Face / (1 + y/m)^n
        </p>
        <p className="mt-2">
          Convexity = (P₋ + P₊ − 2P₀) / (P₀ (Δy)²) — finite-difference, annual-yield units
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Face value = 1,000 PKR · Annual coupon rate = 5% · Frequency = Annually · Years = 10 ·
          YTM = 5% · Yield differential = 0.01%
        </p>
        <p>Annual coupon = 50 PKR · Coupon per period = 50 PKR</p>
        <p>Bond trades at par → Bond price = 1,000 PKR</p>
        <p>
          Reprice at 4.99% and 5.01%, then apply the finite-difference convexity formula (not
          analytic Macaulay convexity).
        </p>
      </div>

      <h2
        id="bond-convexity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOND_CONVEXITY_FAQS]} />
      </div>
    </article>
  );
}
