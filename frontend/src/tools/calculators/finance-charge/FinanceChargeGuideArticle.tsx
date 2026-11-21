import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FINANCE_CHARGE_FAQS } from './content';

export function FinanceChargeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Finance Charge?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A finance charge is the cost of borrowing for a period—commonly the
        interest on a credit-card or other revolving balance, and sometimes
        including certain fees under product disclosures. APR expresses the
        annual rate; the monetary finance charge also depends on the balance,
        how long it is outstanding, and the issuer’s calculation method.
      </p>

      <h2
        id="six-ways"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find Finance Charge – Six Ways to Calculate Finance Charges
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Average daily balance:</strong> average each day’s balance
          over the cycle, then apply the periodic rate.
        </li>
        <li>
          <strong>Daily balance:</strong> apply the daily rate to each day’s
          ending balance and sum the interest.
        </li>
        <li>
          <strong>Adjusted balance:</strong> start from the previous balance and
          subtract payments/credits before applying interest.
        </li>
        <li>
          <strong>Two-cycle (double cycle) average:</strong> uncommon methods
          that may look across more than one cycle—check local rules and card
          agreements.
        </li>
        <li>
          <strong>Ending balance:</strong> charge interest on the balance at
          cycle end.
        </li>
        <li>
          <strong>Previous balance:</strong> charge interest on the prior
          statement balance regardless of mid-cycle payments.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Not every method is available for every product or jurisdiction. This
        calculator uses a simplified constant-balance approach for estimation.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Finance Charge
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FC = Balance × (APR/100) × (Days/365)</p>
        <p>r_d = APR / (100 × 365)</p>
        <p>Daily charge = Balance × r_d</p>
        <p>Total due ≈ Balance + FC</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $1,000 at 18% APR for 30 days → FC = 1,000 × 0.18 × 30/365 ≈
        $14.79; total ≈ $1,014.79.
      </p>

      <h2
        id="daily-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Daily Periodic Interest
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dividing APR by 365 yields a daily periodic rate used for simple daily
        interest. Intermediate values should keep full precision; rounding to
        currency only at display time avoids drifting totals.
      </p>

      <h2
        id="billing-vs-term"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Billing Cycle vs. Given Term
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Billing cycle uses a whole number of days (for example 28–31). Given
        term converts weeks (×7), months (×365/12), or years (×365) into days.
        Month lengths are approximate because calendar months vary.
      </p>

      <h2
        id="minimize"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Minimize Finance Charges on Your Credit Card
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Pay revolving balances in full when possible.</li>
        <li>Understand grace periods and due dates.</li>
        <li>Make extra payments to cut interest-bearing balances.</li>
        <li>Watch promotional APR end dates and balance-transfer fees.</li>
        <li>Compare card costs before carrying a balance.</li>
      </ul>

      <h2
        id="what-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects Finance Charges?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Outstanding balances, APR, cycle length, purchase and payment timing,
        compounding, grace periods, issuer methods, and fees all influence the
        charge that appears on a statement.
      </p>

      <h2
        id="vs-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Finance Charge vs. Interest Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An interest rate (or APR) is a percentage. A finance charge is a
        currency amount for a period. The same APR produces different charges
        when balances or days change.
      </p>

      <h2
        id="vs-apr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Finance Charge vs. APR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APR alone does not tell you the monetary cost without balance, time,
        and account rules. Use APR with a day count (and method) to estimate
        charges.
      </p>

      <h2
        id="adb-vs-daily"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Daily Balance vs. Average Daily Balance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Daily balance methods apply interest each day to that day’s balance.
        Average daily balance averages those balances first, then applies the
        periodic rate once. Mid-cycle payments usually change both results
        relative to a fixed-balance estimate.
      </p>

      <h2
        id="payments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Payments Affect Finance Charges
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Paying down the balance during a cycle reduces later daily balances in
        real issuer methods. This calculator’s main mode assumes the balance
        stays constant for every day in the period.
      </p>

      <h2
        id="products"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Finance Charges on Different Lending Products
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Credit cards, personal loans, installment loans, lines of credit, and
        promotional financing can use different day counts, compounding, and
        fee structures. Do not treat the card-style estimate as universal.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of This Calculator
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Assumes a constant balance and simple interest.</li>
        <li>Uses a 365-day year; months ≈ 365/12 days.</li>
        <li>Does not model purchases, payments, or multiple APRs.</li>
        <li>Does not include unentered fees or issuer-specific rules.</li>
        <li>Cannot guarantee exact statement charges.</li>
      </ul>

      <h2
        id="disclaimer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Disclaimer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool provides educational estimates only. For exact finance
        charges, rely on your lender’s disclosures and statements, and seek
        professional advice when needed.
      </p>

      <h2
        id="fc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...FINANCE_CHARGE_FAQS]} />
      </div>
    </article>
  );
}
