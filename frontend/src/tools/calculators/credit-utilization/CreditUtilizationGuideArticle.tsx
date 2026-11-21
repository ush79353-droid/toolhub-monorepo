import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CREDIT_UTILIZATION_FAQS } from './content';

export function CreditUtilizationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cu"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Credit Utilization Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Credit utilization measures how much of your available revolving credit
 you are currently using. Revolving accounts, credit cards and similar
 lines, have balances that can rise and fall and limits that define the
        credit ceiling. Utilization expresses that relationship as a percentage:
        total outstanding revolving balances divided by total revolving credit
        limits.
      </p>

      <h2
        id="benefits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Benefits of Knowing Your Credit Utilization Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tracking utilization helps you monitor outstanding balances, plan
        repayments, avoid over-limit borrowing, compare cards, and understand
        one factor that many credit-scoring systems consider. It does not by
        itself determine your credit score.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Card Utilization Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CU = (Total Credit Used ÷ Total Credit Limit) × 100</p>
        <p>U_total = Σ Uᵢ · L_total = Σ Lᵢ</p>
        <p>Available = L_total − U_total</p>
        <p>TargetUsed = (TargetRate / 100) × L_total</p>
        <p>Reduction = max(0, U_total − TargetUsed)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Uᵢ is money used on line i; Lᵢ is that line’s credit limit. Overall
 utilization always aggregates first, never averages the individual card
        percentages.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Card Utilization Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$500 used / $2,000 limit → 25.00%</p>
        <p>
          Cards: $400/$4,000 + $500/$4,000 + $8,500/$17,000 → used $9,400 ·
          limit $25,000 → 37.60%
        </p>
      </div>

      <h2
        id="multiple-cards"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Utilization for Multiple Cards
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>List each revolving balance and its credit limit.</li>
        <li>Add all balances to get total credit used.</li>
        <li>Add all limits to get total credit limit.</li>
        <li>Divide total used by total limit and multiply by 100.</li>
        <li>Optionally review each card’s own Uᵢ/Lᵢ percentage.</li>
      </ol>

      <h2
        id="scores"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Credit Utilization Can Affect Credit Scores
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revolving utilization is one component among many in common scoring
        systems. Reported balances, which cards appear on a report, and the
        specific model all matter. A change in utilization does not guarantee a
        particular score movement.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Credit Utilization Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The often-cited 30% guideline is a rule of thumb, not a universal
        scoring threshold. Lower utilization is frequently preferred, but
        payment history, credit mix, inquiries, and other factors also shape
        creditworthiness.
      </p>

      <h2
        id="reduce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Credit Utilization
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Paying down revolving balances, timing payments before balances are
        reported, avoiding unnecessary new charges, and staying within limits
        can lower utilization. Requesting a higher limit can also change the
 math if balances stay the same, subject to lender approval.
      </p>

      <h2
        id="vs-dti"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Credit Utilization vs. Debt-to-Income Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Utilization compares revolving balances to revolving limits. Debt-to-
        income compares monthly debt obligations to qualifying income. They
        answer different questions and are not interchangeable.
      </p>

      <h2
        id="per-card"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Per-Card Utilization vs. Overall Utilization
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A $900 balance on a $1,000 card is 90% utilization on that card, yet if
        you also have $1,000 on a $10,000 card, overall utilization is
        $1,900/$11,000 ≈ 17.3%. Both views can matter; this calculator reports
        the aggregate figure as the primary result.
      </p>

      <h2
        id="over-100"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens When Credit Utilization Exceeds 100%?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If total used exceeds total limits, utilization rises above 100% and
        available credit becomes negative (over-limit). The calculator keeps
        the true percentage instead of silently capping at 100%.
      </p>

      <h2
        id="limit-increase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does a Credit Limit Increase Reduce Utilization?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Mathematically, Yes: if balances are unchanged, a larger denominator
        lowers the ratio. In practice, limit increases depend on underwriting
        and may not be the preferred strategy for every borrower.
      </p>

      <h2
        id="how-often"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Often Does Credit Utilization Change?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Balances and limits can change daily; the utilization that appears on a
        credit report usually reflects what lenders report on a schedule. Your
        current statement balance may differ from the last reported figure.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of a Credit Utilization Calculator
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>It is not a credit score calculator and cannot predict points.</li>
        <li>Scoring models and bureaus differ by market and product.</li>
        <li>Reported balances may lag your current balances.</li>
        <li>Installment loans are generally outside revolving utilization.</li>
        <li>Currency labels here are denomination only (no FX conversion).</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Credit Utilization Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter money used and credit limit for credit line 1.</li>
        <li>Enter the same fields for credit line 2 (and add more if needed).</li>
        <li>Set an optional target utilization (default 30%).</li>
        <li>
          Review overall utilization, totals, available credit, and reduction
          needed.
        </li>
        <li>Expand per-card utilization for individual percentages.</li>
      </ol>

      <h2
        id="cu-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...CREDIT_UTILIZATION_FAQS]} />
      </div>
    </article>
  );
}
