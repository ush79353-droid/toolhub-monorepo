import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { UK_COIN_WEIGHT_FAQS } from './content';
import { UK_COIN_LABELS, UK_COIN_MASS_GRAMS, UK_COIN_IDS } from './constants';

export function UkCoinWeightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        UK Coin Weight Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how much a set of British coins should weigh using The Royal
        Mint&apos;s published standard masses for circulating 1p through £2
        pieces. Enter whole-number counts for each denomination and read the
        total in grams or kilograms.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For each denomination, multiply the coin count by that coin&apos;s
        standard mass in grams, then add the subtotals. The optional face-value
        line shows the monetary sum of the same counts; it is not used in the
        mass formula.
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/20 p-3 text-xs sm:text-sm">
        {`totalGrams = Σ (count × standardMassGrams)
displayKg = totalGrams / 1000`}
      </pre>

      <h2
        id="royal-mint-masses"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Royal Mint Standard Masses
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        {UK_COIN_IDS.map((id) => (
          <li key={id}>
            {UK_COIN_LABELS[id]}: {UK_COIN_MASS_GRAMS[id]} g
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Masses follow current circulating designs (including the 12-sided £1
        from 2017). Older round £1 coins and some commemoratives differ.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Grams and Kilograms
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose g or kg on the weight field. The underlying gram total stays the
        same; kilograms are grams ÷ 1,000.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is not a scale substitute for banking or legal tender checks. It
        does not model packing materials, dirt, or non-standard planchets.
        Results are educational estimates.
      </p>

      <h2
        id="ukcw-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...UK_COIN_WEIGHT_FAQS]} />
      </div>
    </article>
  );
}
