import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DIVIDEND_YIELD_FAQS } from './content';

export function DividendYieldGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-dividend-yield"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Dividend Yield?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dividend yield measures the annual dividend income relative to the current
        share price. Enter the dividend paid each period, how often it is paid, and
        the share price for the same share unit. The calculator annualizes the
        dividend, then reports yield as a percent.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter dividends per period and select a payment frequency.</li>
        <li>Read annual dividends (period dividend × payments per year).</li>
        <li>
          Enter share price to see dividend yield %. Change a money field&apos;s
          currency to convert that amount with stored FX rates; yield % never
          converts.
        </li>
      </ol>

      <h2
        id="dividend-yield-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dividend Yield Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Dividends = Dividends per Period × Payments per Year</p>
        <p>Dividend Yield (%) = Annual Dividends ÷ Share Price × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts keep full precision and round only for display. Frequency and yield
        percent are never FX-converted. Share price must be positive; zero dividends
        are allowed (0% yield).
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Dividends per period = 2.50 PKR · Quarterly (4)</p>
        <p>Annual dividends = 2.50 × 4 = 10.00 PKR</p>
        <p>Share price = 100 PKR</p>
        <p>Dividend yield = 10.00 ÷ 100 × 100 = 10%</p>
      </div>

      <h2
        id="dividend-yield-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DIVIDEND_YIELD_FAQS]} />
      </div>
    </article>
  );
}
