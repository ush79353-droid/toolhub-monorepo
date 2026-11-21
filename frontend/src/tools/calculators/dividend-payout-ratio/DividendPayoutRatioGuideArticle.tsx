import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DIVIDEND_PAYOUT_RATIO_FAQS } from './content';

export function DividendPayoutRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-dividend-payout-ratio"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Dividend Payout Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The dividend payout ratio shows what share of earnings a company returns to
        shareholders as dividends. You can measure it at the company level (total
        dividends ÷ net income) or per share (declared DPS ÷ diluted EPS). Both use
        the same period and consistent units.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total dividends and net income for the same reporting period.</li>
        <li>Optionally open Per share calculation and enter declared DPS and diluted EPS.</li>
        <li>
          Read the payout percentages. Change a money field&apos;s currency to convert
          that amount with stored FX rates; percentages never convert.
        </li>
      </ol>

      <h2
        id="payout-ratio-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payout Ratio Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Dividend Payout Ratio (%) = Total Dividends ÷ Net Income × 100</p>
        <p>
          Dividend Payout Ratio per Share (%) = Dividends per Share ÷ Diluted EPS × 100
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Zero net income or zero
        diluted EPS makes that ratio undefined (not 0%).
      </p>

      <h2
        id="above-100-and-negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Above 100% and Negative Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A ratio above 100% means dividends exceed earnings for the period. A negative
        ratio can appear when the numerator and denominator have opposite signs (for
        example negative net income with positive dividends). Those results are
 mathematically valid diagnostics; they are not equated with a conventional
        sustainable payout target.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total dividends = 40,000 PKR</p>
        <p>Net income = 100,000 PKR</p>
        <p>Payout ratio = 40,000 ÷ 100,000 × 100 = 40%</p>
        <p>Declared DPS = 2 PKR · Diluted EPS = 5 PKR</p>
        <p>Per-share payout = 2 ÷ 5 × 100 = 40%</p>
      </div>

      <h2
        id="dividend-payout-ratio-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DIVIDEND_PAYOUT_RATIO_FAQS]} />
      </div>
    </article>
  );
}
