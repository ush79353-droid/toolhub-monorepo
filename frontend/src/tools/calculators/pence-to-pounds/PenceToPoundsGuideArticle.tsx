import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PENCE_TO_POUNDS_FAQS } from './content';

export function PenceToPoundsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Pence to Pounds Converter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our Pence to Pounds Converter to switch between pence sterling
        (GBX) and pounds sterling (GBP). The relationship is fixed by the
        currency&apos;s subdivision: one hundred pence make one pound. Edit
        either field and the other updates from the amount you last changed.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Conversion Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>GBP = GBX ÷ 100</p>
        <p>GBX = GBP × 100</p>
      </div>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter an amount in pence or in pounds.</li>
        <li>Read the linked counterpart field and the summary result.</li>
        <li>Use Reload for empty defaults or Clear to wipe the current values.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        250 pence ÷ 100 = £2.50. Going the other way, £3.75 × 100 = 375 pence.
      </p>

      <h2
        id="notes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GBX vs GBP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GBP is the ISO code for pound sterling. GBX is commonly used when the
        same currency is quoted in pence (for example in equity tickers). This
        tool does not convert GBP into USD, EUR, or any other currency.
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
          </Link>
        </li>
      </ul>

      <h2
        id="pence-to-pounds-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PENCE_TO_POUNDS_FAQS]} />
      </div>
    </article>
  );
}
