import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { APR_FAQS } from './content';

export function AprGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-apr"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is APR (Annual Percentage Rate)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual percentage rate (APR) expresses the yearly cost of borrowing in
        percentage terms. Unlike a quoted interest rate alone, a useful APR
        estimate incorporates how much cash you actually receive and the
        scheduled repayments you must make. This calculator produces an{' '}
        <strong>estimated</strong> cash-flow APR for education and comparison —
        not a certified regulatory disclosure.
      </p>

      <h2
        id="apr-vs-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR vs. Interest Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The interest rate sets the periodic charge on the amortizing balance and
        therefore the payment size. APR answers a different question: what
        periodic discount rate makes the present value of those payments equal
        the net proceeds you receive after qualifying fees? When fees are zero,
        APR closely matches the nominal rate under this payment-frequency
        convention. When fees reduce proceeds, APR rises above the nominal rate.
      </p>

      <h2
        id="how-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does an APR Calculator Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You enter principal, nominal annual rate, term, payment frequency, and
        fees, plus how fees are paid. The tool computes the amortizing payment,
        builds net proceeds, solves for the implied periodic rate, annualizes
        it to APR, and optionally shows EAR and a payment schedule.
      </p>

      <h2
        id="apr-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = i / m (periodic nominal rate)</p>
        <p>PMT = P × r / (1 − (1 + r)^(−n)) · if r = 0: PMT = P / n</p>
        <p>NetProceeds = PMT × (1 − (1 + r_APR)^(−n)) / r_APR</p>
        <p>APR = r_APR × m × 100%</p>
        <p>EAR = ((1 + r_APR)^m − 1) × 100%</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Because the APR equation is nonlinear in r_APR, the calculator uses a
        bounded numerical solver (bisection) rather than a simple
        interest-plus-fees ÷ principal shortcut.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate APR Step by Step
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose payment frequency and convert the term into n payments.</li>
        <li>Resolve fees (fixed or % of principal) and fee treatment.</li>
        <li>Set amortizing principal and net proceeds from that treatment.</li>
        <li>Compute PMT from the nominal periodic rate.</li>
        <li>Solve r_APR so PV of the payment stream equals net proceeds.</li>
        <li>Annualize: APR = r_APR × periods per year × 100.</li>
      </ol>

      <h2
        id="fees-included"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Fees Are Included in APR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Finance charges such as origination fees and certain lender fees often
        belong in APR analyses. Appraisal, title, escrow deposits, and many
        optional third-party costs may be excluded from legal APR. Enter only
        charges you want treated as finance fees in this estimate.
      </p>

      <h2
        id="personal-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR for Personal Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Personal installment loans frequently quote a rate plus an origination
        fee. Comparing APRs (and total payments) across similar terms helps
        reveal which offer is cheaper when fees differ.
      </p>

      <h2
        id="mortgages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR for Mortgages
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage APR disclosures follow detailed finance-charge rules and may
        include points, mortgage insurance in some cases, and other prepaid
        finance charges. Use a mortgage-specific quote for closing decisions;
        this tool is a simplified installment cash-flow estimate.
      </p>

      <h2
        id="auto-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR for Auto Loans
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Auto financing can bundle dealer fees or add-ons. An APR that includes
        only qualifying finance charges is more comparable than shopping by
        monthly payment alone.
      </p>

      <h2
        id="credit-cards"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR for Credit Cards
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Credit card APR applies to revolving balances with daily or monthly
        compounding and variable payments. It is not the same problem as a
        fixed-payment amortizing loan solved here.
      </p>

      <h2
        id="fixed-vs-variable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed APR vs. Variable APR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed-rate installment loans keep the modeled rate constant. Variable
        products can change over time, so a single APR snapshot may not describe
        lifetime cost. This calculator assumes a constant nominal rate for the
        schedule.
      </p>

      <h2
        id="apr-vs-apy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR vs. APY
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APR describes borrowing cost. APY describes deposit yield with
        compounding. Do not treat a loan APR and a savings APY as
        interchangeable metrics.
      </p>

      <h2
        id="apr-vs-ear"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR vs. Effective Annual Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here, APR is the nominal annualization of the solved periodic rate
        (r × m). EAR compounds that periodic rate: (1 + r)^m − 1. EAR is shown
        separately so the two conventions are never mixed without labels.
      </p>

      <h2
        id="fees-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Loan Fees Affect APR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $10,000 at 10% for 2 years, monthly, with a $200 fee deducted
        from proceeds. Payment is about $461.45 on $10,000, but you receive
        $9,800 — estimated APR rises to roughly 12.1%.
      </p>

      <h2
        id="term-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Loan Term Affect APR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A fixed fee hurts APR more on a short loan because the fee is a larger
        share of the cash-flow economics. Longer terms usually dilute a fixed
        fee’s APR impact while increasing total interest paid.
      </p>

      <h2
        id="compare-loans"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Loans Using APR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Align amount, term, and payment frequency first. Then compare estimated
        APR, total payments, and cash due at closing. Mismatched structures make
        APR rankings misleading.
      </p>

      <h2
        id="good-apr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good APR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “Good” depends on creditworthiness, loan type, collateral, and market
        conditions. Use peer offers and total cost — not a single universal
        cutoff.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of APR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APR may exclude important cash costs, assume on-time full-term
        repayment, and ignore rate resets or prepayment. Early payoff and
        variable rates change real outcomes. This tool is an estimate under
        stated assumptions.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common APR Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Treating APR and the nominal interest rate as identical always.</li>
        <li>Using a simple fee ÷ principal shortcut for amortizing loans.</li>
        <li>Mixing APR with EAR or APY without labeling the convention.</li>
        <li>Including non-finance charges or double-counting fees.</li>
        <li>Ignoring payment frequency when converting annual rates.</li>
      </ul>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        APR Calculator Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Zero fees: $10,000 · 10% · 2y monthly → APR ≈ 10% · PMT ≈ $461.45</p>
        <p>
          Deducted $200 fee → proceeds $9,800 · same PMT → APR ≈ 12.1%
        </p>
        <p>0% · $12,000 · 1y monthly · $0 fees → PMT $1,000 · APR 0%</p>
        <p>0% · $300 deducted fee → proceeds $11,700 · APR &gt; 0%</p>
      </div>

      <h2
        id="apr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={APR_FAQS} />
      </div>
    </article>
  );
}
