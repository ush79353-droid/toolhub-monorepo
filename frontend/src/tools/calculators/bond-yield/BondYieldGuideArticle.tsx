import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOND_YIELD_FAQS } from './content';

export function BondYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bond-yield"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Bond Yield to Maturity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yield to maturity (YTM) is the constant annual nominal discount rate that makes the
        present value of a bond&apos;s remaining coupons and face value equal its clean market
        price. This tool solves that rate numerically. It is not current yield, and it assumes
        settlement on a coupon date with regular full periods.
      </p>

      <h2
        id="bond-yield-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Yield to Maturity Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>C = F × (r / m)</p>
        <p className="mt-2">N = years × m</p>
        <p className="mt-2">
          P = Σ<sub>t=1…N</sub> C / (1 + y/m)<sup>t</sup> + F / (1 + y/m)<sup>N</sup>
        </p>
        <p className="mt-2">Solve for annual nominal y (reported as y × 100 %)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        F is face value, P is bond price, r is the annual coupon rate as a decimal, m is coupon
        payments per year, and y is the annual nominal YTM. Premium, discount, par, and
        zero-coupon bonds are supported. Negative yields are allowed when mathematically valid
        (y &gt; −m).
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Face value = 1,000 PKR · Bond price = 950 PKR · Coupon = 5% · Annually · 10 years</p>
        <p>C = 50 · N = 10 · solve P = Σ 50/(1+y)^t + 1000/(1+y)^10 = 950</p>
        <p>Bond yield (YTM) ≈ 5.6687%</p>
      </div>

      <h2
        id="bond-yield-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOND_YIELD_FAQS]} />
      </div>
    </article>
  );
}
