import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BLENDED_RATE_FAQS } from './content';

export function BlendedRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-blended"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Blended Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A blended interest rate is the balance-weighted average of the annual
        rates on multiple loans, mortgages, or other interest-bearing balances.
        Because each rate is weighted by its principal, a large low-rate loan
        pulls the blend down more than a small high-rate loan pulls it up. It
        is a portfolio summary metric—not a lender quote by itself.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Blended Rate
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>List each balance and its annual rate (percent).</li>
        <li>Multiply each balance by its rate.</li>
        <li>Add those products to get the weighted rate sum.</li>
        <li>Add the balances to get the total principal.</li>
        <li>Divide the weighted sum by the total principal.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blended Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>R_blended = Σ(Bᵢ × Rᵢ) / Σ(Bᵢ)</p>
        <p>B_total = Σ(Bᵢ)</p>
        <p>I_annual ≈ Σ(Bᵢ × Rᵢ / 100) = B_total × R_blended / 100</p>
        <p>I_monthly ≈ I_annual / 12</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        When rates are entered in percent, the blended result is also a percent.
        Keep all balances in the same currency units.
      </p>

      <h2
        id="vs-average"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blended Rate vs. Average Interest Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The arithmetic mean of 4% and 15% is 9.5%. But $100,000 at 4% and
        $10,000 at 15% blend to 5%—because most of the money sits at 4%. Using
        a simple average would overstate the portfolio rate.
      </p>

      <h2
        id="samples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sample Calculations of Blended Rates
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$10,000 @ 10% + $200 @ 5% → 9.90% · annual interest ≈ $1,010</p>
        <p>$10k @ 5% + $20k @ 8% + $30k @ 12% → 9.50% · annual ≈ $5,700</p>
        <p>$100k @ 4% + $10k @ 15% → 5.00%</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Blended Rate Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the first balance and its annual rate.</li>
        <li>Enter the second balance and rate.</li>
        <li>Fill optional third (or add more) loans as needed.</li>
        <li>Review the blended rate, total balance, and interest estimates.</li>
        <li>Expand weighted contributions to see each loan’s influence.</li>
      </ol>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is the Blended Rate Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It summarizes the average cost of capital across mixed debts, helps
        compare consolidation or refinance ideas against today’s weighted cost,
        and clarifies how portfolio composition—not just headline rates—drives
        overall interest expense.
      </p>

      <h2
        id="mortgages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blended Rate for Multiple Mortgages
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Households or investors with more than one mortgage can weight each
        note by remaining principal. Different amortization speeds mean the
        blend drifts as balances pay down unevenly.
      </p>

      <h2
        id="business"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blended Rate for Business Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Companies often carry term loans, lines of credit, and equipment notes
        at different rates. A blended rate is a quick snapshot of the debt book
        before diving into cash-flow or covenant analysis.
      </p>

      <h2
        id="consolidation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blended Rate and Debt Consolidation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare a consolidation offer’s rate to your current blended rate, but
        also weigh fees, term length, and payment size. A slightly higher rate
        with a shorter term can still reduce total interest.
      </p>

      <h2
        id="vs-refi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Blended Rate vs. Refinancing Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The blended rate describes existing balances. A refinance rate is the
        price of a new loan and may include points, closing costs, and a
        different APR. Do not treat them as interchangeable.
      </p>

      <h2
        id="balances-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Loan Balances Affect the Blended Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Increasing a high-rate balance raises the blend; paying it down lowers
        the blend toward the remaining loans’ rates. Equal balances make each
        rate count equally.
      </p>

      <h2
        id="rates-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Interest Rate Changes Affect the Blended Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If one component rate rises, the blend rises by that loan’s weight times
        the rate change. Variable-rate notes can move the portfolio average
        without any new borrowing.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Blended Rate Calculations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Ignores compounding conventions and payment schedules</li>
        <li>Assumes static balances for annual interest estimates</li>
        <li>Excludes fees, points, and APR adjustments</li>
        <li>Does not model intro rates flipping to regular rates over time</li>
        <li>Not a substitute for full amortization or refinance analysis</li>
      </ul>

      <h2
        id="br-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={BLENDED_RATE_FAQS} />
      </div>
    </article>
  );
}
