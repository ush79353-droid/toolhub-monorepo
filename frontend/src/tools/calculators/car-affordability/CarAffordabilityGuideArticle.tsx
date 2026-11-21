import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAR_AFFORDABILITY_FAQS } from './content';

export function CarAffordabilityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="how-much-car" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        How much car can I afford?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Vehicle affordability depends on more than the sticker price. Your comfortable monthly
        payment, income and existing expenses, savings for a down payment, trade-in equity, loan
 interest rate, and loan term all shape how much you can finance. Ownership costs; insurance,
 fuel, maintenance, registration, and taxes; also matter after you drive away. Qualifying for
        a loan is not the same as comfortably affording a car: lenders measure credit risk, while
        your budget must leave room for life after the payment clears. The maximum car value from
        this calculator is a financing estimate, not a guarantee that the purchase is right for you.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use our car affordability calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong className="font-medium text-accent">Monthly payment you can afford</strong>: the
          primary constraint used to solve for maximum loan principal.
        </li>
        <li>
 <strong className="font-medium text-accent">Money you have</strong>: cash that can go
          toward the purchase (or a specified down-payment allocation in Additional options).
        </li>
        <li>
 <strong className="font-medium text-accent">Current car trade-in value</strong>: positive
          trade-in contribution; subtract remaining loan balance yourself if equity is negative.
        </li>
        <li>
 <strong className="font-medium text-accent">Interest rate</strong>: annual APR on the
          auto loan.
        </li>
        <li>
 <strong className="font-medium text-accent">Loan term</strong>: select Yes and enter years
          and months (default 5 years). Selecting No blocks calculation because a term is required.
        </li>
        <li>
 <strong className="font-medium text-accent">Additional options</strong>: optional sales
          tax %, dealer fees, registration/title fees, other upfront costs, and down-payment
          allocation.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The engine first finds the maximum loan from the payment, rate, and term using the present
        value of an annuity (or payment × months when APR is 0%). Maximum car value adds cash and
        trade-in, then reduces the sticker price when tax and fixed fees apply so the total budget
        still covers acquisition costs. Interest paid is total payments minus the loan amount.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>L = P × (1 − (1+r)^(−n)) / r &nbsp;(r = APR/12; n = months)</p>
        <p className="mt-2">If APR = 0%: L = P × n</p>
        <p className="mt-2">Max car (basic) = L + cash + trade-in</p>
        <p className="mt-2">With tax: price = (budget − fixed fees) / (1 + tax rate)</p>
      </div>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Example: $500/mo · $5,000 cash · $3,000 trade-in · 6% · 5 years</p>
        <p className="mt-2">Loan ≈ $25,862.78 · Max car ≈ $33,862.78 · Interest ≈ $4,137.22</p>
      </div>

      <h2
        id="how-much-spend"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much should you spend on a car?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sensible vehicle budgeting looks at monthly cash flow, household income, existing debts,
 emergency savings, down payment size, loan length, and the full cost of ownership; not only
        the installment. Popular rules (for example, capping transportation as a share of income)
        can be useful prompts, but they are not universal. Prefer a payment you can sustain while
        still funding savings and unexpected repairs.
      </p>

      <h2
        id="total-ownership-costs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What are the total costs of owning a car?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beyond purchase price and loan interest, ownership typically includes sales tax, registration
        and title fees, insurance, fuel, maintenance, repairs, depreciation, parking, and local road
        or congestion charges. A lower sticker price with high insurance or fuel costs can still
        strain a budget. Use Additional options for tax and selected fees; keep operating costs in
        your monthly living budget.
      </p>

      <h2
        id="interest-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How do interest rates affect car affordability?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a fixed monthly payment and term, a higher APR lowers the principal that payment can
        support. Example: $500/mo for 60 months finances about $27,150 at 4% APR versus about
 $24,660 at 8% APR; several thousand dollars less car for the same payment when rates rise.
        Higher rates also increase total interest for a given principal.
      </p>

      <h2
        id="loan-duration"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does loan duration affect car affordability?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Longer terms raise the loan principal supported by a given payment (and can lower the payment
        for a given loan), which can increase the maximum car value. They also usually increase total
 interest and extend the period you remain in debt; sometimes past the point where the car’s
        value has fallen sharply. Shorter terms cost more each month but typically save interest.
      </p>

      <h2
        id="trade-in-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does a trade-in value affect car affordability?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A trade-in can reduce the amount financed or raise the purchase price you can target. Positive
        equity helps; negative equity (owing more than the trade-in is worth) effectively adds debt
 to the new deal. Enter only the trade-in amount that truly reduces what you must pay if you
        still owe on the old loan, net that balance out before treating the trade-in as available
        contribution.
      </p>

      <h2
        id="related-considerations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related financial considerations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Before signing, compare insurance quotes, keep an emergency cushion for repairs, understand
        depreciation on the model you want, read dealer fee line items, and confirm financing terms
 in writing. Stretching for a higher payment can crowd out savings goals: a slightly less
        expensive car that you own sooner is often the stronger financial choice.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/auto-loan-calculator" className="text-primary hover:underline">
            Auto Loan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/loan-calculator" className="text-primary hover:underline">
            Loan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/car-loan-emi-calculator" className="text-primary hover:underline">
            Car Loan EMI Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/accumulated-depreciation-calculator"
            className="text-primary hover:underline"
          >
            Accumulated Depreciation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="car-affordability-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CAR_AFFORDABILITY_FAQS]} />
      </div>
    </article>
  );
}
