import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARGIN_INTEREST_DAY_BASIS } from './calculation';
import { MARGIN_INTEREST_FAQS } from './content';

export function MarginInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-margin-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Margin Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Margin interest is the cost of borrowing cash from a brokerage to buy securities on
        margin. For a given debit balance, annual rate, and number of days the loan is
        outstanding, this calculator estimates simple interest on a {MARGIN_INTEREST_DAY_BASIS}
        -day year.
      </p>

      <h2
        id="margin-interest-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Margin Interest Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Margin Interest = Amount Borrowed × (Annual Rate / 100) × (Days /{' '}
          {MARGIN_INTEREST_DAY_BASIS})
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Amount borrowed = PKR 100,000</p>
        <p>Annual interest rate = 12%</p>
        <p>Number of days = 30</p>
        <p>
          Margin interest = 100,000 × 0.12 × (30 / {MARGIN_INTEREST_DAY_BASIS}) = PKR 1,000.00
        </p>
      </div>

      <h2
        id="margin-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MARGIN_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
