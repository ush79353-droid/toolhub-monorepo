import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOND_PRICE_FAQS } from './content';

export function BondPriceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bond-price"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Bond Price?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bond price is the present value of the bond&apos;s remaining coupon payments plus the
        present value of its face (par) amount at maturity, discounted at the yield to maturity.
        This calculator also reports the contractual annual coupon and the coupon paid each
        period. It assumes settlement on a regular coupon date (clean price) with no accrued
        interest.
      </p>

      <h2
        id="bond-price-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Bond Price Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Coupon = Face Value × Annual Coupon Rate / 100</p>
        <p className="mt-2">Coupon per period = Annual Coupon / m</p>
        <p className="mt-2">N = Years to maturity × m</p>
        <p className="mt-2">
          P = Σ (t=1..N) (F × r / m) / (1 + y/m)^t + F / (1 + y/m)^N
        </p>
        <p className="mt-2">When y = 0: P = (F × r / m) × N + F</p>
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
          YTM = 5%
        </p>
        <p>Annual coupon = 1,000 × 0.05 = 50 PKR</p>
        <p>Coupon per period = 50 / 1 = 50 PKR</p>
        <p>N = 10 · i = 0.05</p>
        <p>
          Bond price = 50 × (1 − 1.05^−10) / 0.05 + 1,000 / 1.05^10 = 1,000.00 PKR (par bond)
        </p>
      </div>

      <h2
        id="bond-price-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOND_PRICE_FAQS]} />
      </div>
    </article>
  );
}
