import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEFERRED_PAYMENT_LOAN_FAQS } from './content';

export function DeferredPaymentLoanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-deferment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Loan Deferment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loan deferment (a payment holiday) temporarily suspends scheduled principal-and-interest
        payments. Interest may still accrue, depending on the lender. This calculator compares the
        original amortization with a deferred schedule so you can see how monthly payment, total
        interest, term, and payoff date change.
      </p>

      <h2
        id="how-deferment-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Deferred Payment Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start from the current balance and remaining term (or from a fixed monthly payment). The
        tool advances the schedule to the deferment start date, suspends payments for the chosen
        number of months while applying the selected interest treatment, then rebuilds the
        post-deferment payment using the selected repayment style. Comparison figures for the
        deferment column refer to the post-deferment period.
      </p>

      <h2
        id="interest-treatments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interest Treatments
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Capitalized</strong>: unpaid interest compounds into principal during the pause.
        </li>
        <li>
 <strong>Paid monthly</strong>: interest is paid in cash each month; principal stays flat.
        </li>
        <li>
 <strong>Paid in equal parts</strong>: interest accrues separately and is repaid in equal
          installments alongside the re-amortized principal payment.
        </li>
        <li>
 <strong>Interest-free</strong>: balance is unchanged and no deferment interest is charged.
        </li>
      </ul>

      <h2
        id="repayment-types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Repayment After Deferment
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Increased payment - original term</strong>: keep the original payoff date; raise
          the payment over the shorter remaining term.
        </li>
        <li>
 <strong>Increased payment - extended term</strong>: extend the term by the deferment
          length and re-amortize the post-deferment balance.
        </li>
        <li>
 <strong>Original payment - extended term</strong>: keep the original payment and solve for
          how many months are needed to clear the post-deferment balance.
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = 100,000 PKR</p>
        <p>Term = 10 years · Rate = 5% · Compounding = Monthly</p>
        <p>Deferment = 12 months · Interest = Capitalized · Repayment = Increased payment - original term</p>
        <p>Original monthly payment ≈ 1,060.66 PKR</p>
        <p>Balance after deferment ≈ 105,116.19 PKR (interest ≈ 5,116.19 PKR)</p>
        <p>Post-deferment monthly ≈ 1,210.65 PKR over 108 payments (9 years)</p>
      </div>

      <h2
        id="deferred-payment-loan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEFERRED_PAYMENT_LOAN_FAQS]} />
      </div>
    </article>
  );
}
