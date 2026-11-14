import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INTEREST_RATE_FAQS } from './content';

export function InterestRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-interest-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Interest Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An interest rate is the price of borrowing money or the return earned on a deposit,
        usually quoted as a yearly percentage of principal. This calculator reverse-solves that
        rate from known loan payments or from a deposit&apos;s starting and ending balances.
      </p>

      <h2
        id="interest-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Calculator Works
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan: PV = PMT × [1 − (1 + r)^(−n)] / r</p>
        <p className="mt-2">EAR = (1 + nominal / m)^m − 1</p>
        <p className="mt-2">Deposit: FV = PV × (1 + r / m)^(m × t)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        For loans, APR folds prepaid and loaned fees into the cash-flow cost of credit. For
        deposits, the implied nominal rate and EAR come from the growth between the initial
        deposit and current balance over the chosen term and capitalization schedule.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = PKR 10,000</p>
        <p>Term = 10 years, monthly payments of PKR 150</p>
        <p>Monthly capitalization</p>
        <p>Prepaid fees = PKR 200, loaned fees = PKR 300</p>
        <p>Annual nominal ≈ 13.1167%, EAR ≈ 13.9347%, APR ≈ 14.9759%</p>
      </div>

      <h2
        id="interest-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INTEREST_RATE_FAQS]} />
      </div>
    </article>
  );
}
