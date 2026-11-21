import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BOND_EQUIVALENT_YIELD_FAQS } from './content';

export function BondEquivalentYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bey"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Bond Equivalent Yield?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bond equivalent yield (BEY) expresses the return on a discount instrument
        as an annualized percentage on an investment basis: the discount is
        measured against the purchase price, then scaled to a year. This
        calculator uses a 365-day year. It is not bank discount yield, yield to
        maturity, or coupon current yield.
      </p>

      <h2
        id="bey-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BEY Formula (365-Day)
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          BEY (%) = ((Face Value − Bond Price) / Bond Price) × (365 / Days to
          Maturity) × 100
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Actual/365 investment basis · discount or par only · money amounts
          share one currency before the ratio
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Bond price = 980 PKR · Face value = 1,000 PKR · Days = 180</p>
        <p>Holding-period return = (1,000 − 980) / 980 = 20 / 980</p>
        <p>Annualization = 365 / 180</p>
        <p>
          BEY = (20 / 980) × (365 / 180) × 100 ≈ 4.1383219955%
        </p>
      </div>

      <h2
        id="bond-equivalent-yield-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BOND_EQUIVALENT_YIELD_FAQS]} />
      </div>
    </article>
  );
}
