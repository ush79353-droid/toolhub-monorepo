import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IRP_DAY_BASIS } from './calculation';
import { INTEREST_RATE_PARITY_FAQS } from './content';

export function InterestRateParityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-irp"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Interest Rate Parity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest rate parity links today&apos;s spot FX quote to a future exchange rate using the
        interest rates of the price (quote) and base currencies. Covered parity describes a
        no-arbitrage forward; uncovered parity describes an expected future spot without a locked
        hedge.
      </p>

      <h2
        id="irp-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IRP Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Spot quote S = price-currency units per 1 base-currency unit</p>
        <p className="mt-2">
          Period rate % = Annualised rate % × (Days / {IRP_DAY_BASIS})
        </p>
        <p className="mt-2">
          Covered: F = S × (1 + r_price) / (1 + r_base)
        </p>
        <p className="mt-2">
          Uncovered: E[S] = S × (1 + (r_price − r_base))
        </p>
        <p className="mt-2">r_price and r_base are period rates as decimals</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Covered · 90 days · annualised price 0.8% · annualised base 3.2% · spot 0.1735
        </p>
        <p>
          Period price 0.2% · period base 0.8% · F = 0.1735 × 1.002 / 1.008 ≈ 0.1725
        </p>
      </div>

      <h2
        id="irp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INTEREST_RATE_PARITY_FAQS]} />
      </div>
    </article>
  );
}
