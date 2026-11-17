import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_WITH_EXTRA_PAYMENTS_FAQS } from './content';

export function MortgageWithExtraPaymentsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are-extra-mortgage-payments"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Extra Mortgage Payments?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extra payments reduce principal sooner—either by paying more often
        (accelerated bi-weekly or weekly), adding a recurring amount to each
        installment, or making a one-time lump-sum prepayment. Less principal
        outstanding means less interest over the life of the loan and an earlier
        payoff date.
      </p>

      <h2
        id="how-this-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How This Calculator Works
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = mortgage amount · i = annual rate · N = term in months</p>
        <p className="mt-2">
          Monthly rate r = i/12 (US &amp; UK) or (1 + i/2)^(1/6) − 1 (Canada)
        </p>
        <p className="mt-2">
          Monthly payment M = P × r / (1 − (1+r)^(−N)); if r = 0: M = P / N
        </p>
        <p className="mt-2">
          Accelerated bi-weekly installment = M / 2, charged 26 times per year
        </p>
        <p className="mt-2">
          Each period: interest = balance × period rate; payment reduces
          principal after interest; extras apply on/after their dates
        </p>
      </div>

      <h2
        id="accelerated-biweekly-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accelerated Bi-Weekly Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Mortgage = 135,000 · Rate = 4.5% · Term = 20 years · Monthly (US &amp; UK)</p>
        <p>Original monthly payment ≈ 854.08 · Term 20 yrs 0 mos · Interest ≈ 69,978.40</p>
        <p>
          Accelerated bi-weekly (no cash extras) ≈ 427.04 every two weeks · Term ≈
          17 yrs 7 mos · Interest ≈ 60,526
        </p>
        <p>Frequency change alone shortens the loan by roughly 2 years 5 months.</p>
      </div>

      <h2
        id="mortgage-with-extra-payments-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MORTGAGE_WITH_EXTRA_PAYMENTS_FAQS]} />
      </div>
    </article>
  );
}
