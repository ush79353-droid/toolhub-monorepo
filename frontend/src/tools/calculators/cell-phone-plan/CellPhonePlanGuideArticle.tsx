import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CELL_PHONE_PLAN_FAQS } from './content';

export function CellPhonePlanGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="costs-outright"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        The costs of buying a phone outright
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buying a phone outright means paying the full retail price immediately, then using a
        SIM-only or bring-your-own-device plan for service. Over a contract you still pay every
        monthly service bill, and you remain responsible for repairs or replacement. The cash leaves
        your account on day one, so you forgo whatever return that money could have earned elsewhere.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total cost = Phone price + (Monthly bill × Contract months)</p>
      </div>

      <h2
        id="costs-carrier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The costs of getting a phone-buying carrier plan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A carrier phone-buying plan typically bundles device installments with mobile service into
        one higher monthly bill. You avoid the large upfront purchase, but you pay more each month
        for the contract length. This calculator models an alternative use of the phone’s retail
        price: deposit it in savings, earn monthly-compounded interest, and withdraw the difference
        between the carrier bill and the own-phone bill each month. Interest earned reduces the
        carrier plan’s effective total cost.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total payments = Carrier monthly bill × Contract months</p>
        <p className="mt-2">Effective total cost = Total payments − Interest earned</p>
      </div>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Deposit the phone’s retail price at the start.</li>
        <li>Earn interest monthly on the remaining balance.</li>
        <li>Withdraw the monthly bill difference (carrier − own-phone), never a negative withdrawal.</li>
        <li>Keep the residual invested for the full contract.</li>
        <li>Sum monthly interest to get interest earned.</li>
      </ol>

      <h2
        id="comparison-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cell phone plan comparison: an example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Phone retail price $800 · Contract 24 months · Carrier plan $50/mo · Own-phone bill $20/mo ·
        Savings interest 4% annual (monthly compounding). Load example in the calculator uses these
        same inputs.
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Start with the $800 retail phone price.</li>
        <li>Use a 24-month comparison window.</li>
        <li>Carrier monthly bill = $50.</li>
        <li>Own-phone monthly bill = $20.</li>
        <li>Savings rate = 4% per year.</li>
        <li>Outright total = 800 + 20 × 24 = $1,280.</li>
        <li>Monthly withdrawal = 50 − 20 = $30.</li>
        <li>Simulate savings (withdraw, then interest) → interest ≈ $35.73.</li>
        <li>Carrier effective cost = 50 × 24 − 35.73 = $1,164.27.</li>
        <li>Carrier plan is cheaper by ≈ $115.73.</li>
      </ol>
      <div className="my-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Metric</th>
              <th className="px-3 py-2 text-right font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Outright purchase cost</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$1,280</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Monthly withdrawal</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$30</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Interest earned</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$35.73</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Carrier-plan effective cost</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$1,164.27</td>
            </tr>
            <tr className="border-t border-border bg-muted/30 font-medium">
              <td className="px-3 py-1.5">Carrier-plan savings</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$115.73</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="which-cheaper"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Which is cheaper: buying a phone outright or through a carrier?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buying outright can win when you lack a reliable savings rate, when the carrier bill premium
        is large, or when you value ownership flexibility. Carrier financing can win when the
        effective cost after realistic interest is lower and you will keep the invested cash
        disciplined. Contract locks, promotion fine print, and whether you would actually invest the
 phone price all matter: the calculator does not claim carrier plans are always cheaper.
      </p>

      <h2
        id="interest-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How interest rates affect your phone plan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher savings rates increase interest earned when the withdrawal plan stays feasible, which
        lowers the carrier plan’s effective cost. Monthly compounding applies the annual rate ÷ 12 to
 the balance after each withdrawal. Results are estimates for the rate you enter; not a
        guaranteed investment return, and not the carrier’s loan APR.
      </p>

      <h2
        id="how-to-choose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to choose the best cell phone plan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Look past the advertised monthly price. Compare total contract cost, data and coverage needs,
        early termination fees, device locks, upfront payments, and how easily you can replace or
        upgrade the phone. Use this tool for the financing-vs-cash comparison, then confirm network
        quality and contract terms before signing.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-goal-calculator" className="text-primary hover:underline">
            Savings Goal Calculator
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
          <Link href="/tools/loan-calculator" className="text-primary hover:underline">
            Loan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="cell-phone-plan-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CELL_PHONE_PLAN_FAQS]} />
      </div>
    </article>
  );
}
