import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FORWARD_PREMIUM_FAQS } from './content';
import { FORWARD_PREMIUM_DAY_COUNT_BASIS } from './types';

export function ForwardPremiumGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Forward Premium Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this calculator to turn a spot rate and a matching forward rate into
        a period forward premium (or discount) and a simple annualized premium
        for the contract tenor. It is a quote-arithmetic tool for FX and related
        forward markets—not a covered-interest-parity model and not trade advice.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Forward Premium?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under a consistent quote convention, the forward premium measures how
        much more expensive the base currency is for future delivery than for
        spot. When the forward is cheaper than spot, the same formula reports a
        negative premium—a forward discount.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Forward Premium Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Forward premium % = ((F − S) / S) × 100</p>
        <p>S = spot rate · F = forward rate</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both rates must use the same units (for example, quote currency per one
        unit of base). Inverting one leg without adjusting the other invalidates
        the percentage.
      </p>

      <h2
        id="annualized"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annualized Forward Premium
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Annualized premium % = period premium % × ({FORWARD_PREMIUM_DAY_COUNT_BASIS}{' '}
          / days)
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annualization lets you compare premiums across different contract
        lengths. This site uses a {FORWARD_PREMIUM_DAY_COUNT_BASIS}-day year when
        no day-count selector is shown. Money-market Actual/360 quotes need an
        explicit conversion if your desk uses 360.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm spot and forward share the same quote convention.</li>
        <li>
          Compute ((F − S) / S) × 100 for the period premium (negative if F &lt;
          S).
        </li>
        <li>
          Multiply by {FORWARD_PREMIUM_DAY_COUNT_BASIS} / contract days for the
          annualized premium.
        </li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the spot rate, forward rate, and duration in days. The calculator
        fills the period and annualized premiums. You can also edit the premium
        or annualized premium to reverse-solve linked rates. Reload restores the
        example; Clear empties the form.
      </p>

      <h2
        id="premium-vs-discount"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Premium vs Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive values mean the forward trades rich to spot (premium). Negative
        values mean the forward trades cheap to spot (discount). Zero means the
        forward equals the spot under your inputs.
      </p>

      <h2
        id="day-count"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Day-Count Basis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simple annualization here divides by contract days and scales by{' '}
        {FORWARD_PREMIUM_DAY_COUNT_BASIS}. Other conventions (360, Actual/Actual)
        change the annualized figure even when the period premium is unchanged.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Spot 1.25, forward 1.28, 90-day contract: period premium = ((1.28 − 1.25)
        / 1.25) × 100 = 2.4%. Annualized ≈ 2.4 × (365 / 90) ≈ 9.7333%.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Does not embed interest-rate parity or funding spreads.</li>
        <li>Does not adjust for bid/offer, points conventions, or broken dates.</li>
        <li>Does not convert currencies or fetch live market rates.</li>
        <li>Educational arithmetic only—not investment or hedging advice.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <Link
          href="/tools/currency-forward-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Currency Forward
        </Link>
        {' · '}
        <Link
          href="/tools/carry-trade-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Carry Trade
        </Link>
        {' · '}
        <Link
          href="/tools/ppp-calculator-purchasing-power-parity"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Purchasing Power Parity
        </Link>
      </p>

      <h2
        id="forward-premium-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...FORWARD_PREMIUM_FAQS]} />
      </div>
    </article>
  );
}
