import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SINKING_FUND_FAQS } from './content';

export function SinkingFundGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-sinking-fund"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Sinking Fund?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A sinking fund accumulates a target amount through equal deposits that earn interest. The
        uniform series sinking fund (USSF) factor tells you how large each deposit must be for a
        given rate, compounding frequency, and time horizon.
      </p>

      <h2
        id="sinking-fund-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (Annual rate / 100) / m</p>
        <p>n = m × (years + months / 12)</p>
        <p>USSF = i / ((1 + i)^n − 1) &nbsp; (or 1 / n when i = 0)</p>
        <p>Required contribution = FV × USSF</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Months convert as months÷12 of a year, so n may be fractional. Contributions are equal
        amounts at the end of each compounding period for the selected frequency.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Money to accumulate = PKR 100,000</p>
        <p>Annual interest rate = 5%</p>
        <p>Compounding = Yearly (m = 1)</p>
        <p>Period = 5 years</p>
        <p>i = 0.05, n = 5</p>
        <p>USSF ≈ 0.180975</p>
        <p>Required contribution ≈ PKR 18,097.48 per year</p>
      </div>

      <h2
        id="sinking-fund-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SINKING_FUND_FAQS]} />
      </div>
    </article>
  );
}
