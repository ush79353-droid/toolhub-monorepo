import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CROSS_EXCHANGE_RATE_FAQS } from './content';

export function CrossExchangeRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cross Exchange Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our Cross Exchange Rate Calculator when you know how currencies A
        and B each trade against a shared bridge currency C, and you need the
        implied A/B (and B/A) cross. Enter one quote direction for each source
        pair; the calculator derives reciprocals and the cross rates. Quotes are
        user-entered — this tool does not pull live market FX.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Cross Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A cross rate is an exchange rate between two currencies that is inferred
        from their rates versus a third currency. Traders and students often
        reconstruct a less-liquid pair from two liquid pairs that share a
        common quote currency (for example, reconstructing EUR/GBP from EUR/USD
        and GBP/USD). Letters A, B, and C are placeholders — assign any three
        distinct currencies consistently.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cross Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>C/A = 1 ÷ (A/C)</p>
        <p>C/B = 1 ÷ (B/C)</p>
        <p>A/B = (A/C) ÷ (B/C)</p>
        <p>B/A = 1 ÷ (A/B)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep the quote convention consistent: if A/C means units of C per one A,
        then B/C must also mean units of C per one B before dividing. Mixing
        inverted quotes without converting them first produces an incorrect
        cross.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          In the first currency pair, enter either A/C or C/A (not conflicting
          values for both).
        </li>
        <li>
          In the second currency pair, enter either B/C or C/B.
        </li>
        <li>
          Read the computed cross rates A/B and B/A. Expand calculation steps
          for the arithmetic trail.
        </li>
        <li>
          Use Reload to restore empty defaults, or Clear to wipe the current
          entries.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose A/C = 1.10 and B/C = 1.25. Then A/B = 1.10 ÷ 1.25 = 0.88, and
        B/A = 1 ÷ 0.88 ≈ 1.136364. The same result follows if you instead enter
        C/A ≈ 0.909091 and C/B = 0.80, because those are the reciprocals of the
        original legs.
      </p>

      <h2
        id="notes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quoting Conventions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market quotes may invert which currency is the base. Always convert both
        legs into the same A/C and B/C orientation before applying the
        division formula. This calculator rejects zero or negative rates and
        flags double-entry conflicts when both directions of a pair are filled
        with values that are not reciprocals.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/currency-forward-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Currency Forward Calculator
          </Link>{' '}
          — CIP forward points from spot and interest rates.
        </li>
        <li>
          <Link
            href="/tools/carry-trade-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Carry Trade Calculator
          </Link>{' '}
          — funding vs investment currency carry scenarios.
        </li>
      </ul>

      <h2
        id="cross-exchange-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CROSS_EXCHANGE_RATE_FAQS]} />
      </div>
    </article>
  );
}
