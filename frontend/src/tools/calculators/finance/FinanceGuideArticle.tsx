import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FINANCE_FAQS } from './content';

export function FinanceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
 The Finance Calculator solves the five classic time-value-of-money variables; future value
        (FV), periodic payment (PMT), interest rate (I/Y), number of periods (N), and present value
        (PV). It works like a BA II Plus or HP 12C for investment planning, loan analysis, savings
        projections, and finance coursework. Enter four known values, choose which variable to solve,
        and adjust payment frequency, compounding, and payment timing in Settings.
      </p>

      <h2
        id="time-value-of-money"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        The Time Value of Money (TVM)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A dollar available today can earn interest, so it is usually worth more than the same dollar
        promised later. Compounding grows a present amount into a future amount; discounting works
        the other direction. Present value and future value are two sides of that relationship,
        linked by the interest rate and the number of periods.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suppose someone invests $100 in an account that earns 10% annually. After one year:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FV = 100 × (1 + 0.10) = $110</p>
        <p className="mt-2">After two years: FV = 110 × (1.10) = $121</p>
        <p className="mt-2">Discounting back: PV = 121 / (1.10)² = $100</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        The $21 of growth is interest on the original principal plus interest earned on prior
 interest: the essence of compounding. Adding periodic payments (PMT) extends the same idea
        to loans and savings plans.
      </p>

      <h2
        id="pmt-section"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PMT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PMT is a cash flow that repeats every period: loan installments, mortgage payments, annuity
        withdrawals, or regular investment deposits. Payments at the end of each period form an
        ordinary annuity; payments at the beginning form an annuity due. Use Settings → Payment
 timing to switch. Cash-flow signs matter; money received is positive; money paid is
 negative, so a typical loan draw might use a positive PV and a negative PMT.
      </p>

      <h2
        id="finance-class"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Finance class
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Finance courses lean on these five keys for amortization, bond pricing intuition, capital
        budgeting discounting, and investment return problems. A calculator that can solve any of
        FV, PMT, I/Y, N, or PV lets students check homework against the same identities used in
        professional financial calculators without rewriting formulas for each unknown.
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The importance of the Finance Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Everyday decisions; comparing loan offers, estimating how long savings will last, or
 finding the rate implied by a payment stream; are TVM problems. This tool keeps the math
        consistent across payment frequencies and compounding conventions so you can focus on the
        scenario instead of rearranging equations by hand.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/loan-calculator" className="text-primary hover:underline">
            Loan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/average-return-calculator" className="text-primary hover:underline">
            Average Return Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="finance-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FINANCE_FAQS]} />
      </div>
    </article>
  );
}
