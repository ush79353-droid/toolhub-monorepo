import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LCR_FAQS } from './content';

export function LcrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
 LCR Calculator; Liquidity Coverage Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Liquidity Coverage Ratio (LCR) estimates whether a bank’s stock of
        high-quality liquid assets (HQLA) can cover expected net cash outflows
 over a 30-calendar-day stress period. Enter HQLA and net outflows; or
 use the optional helpers, to compute LCR, coverage multiple, and
        surplus or shortfall. This page is an educational estimation tool, not a
        regulatory filing or compliance opinion.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Liquidity Coverage Ratio (LCR)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LCR is a Basel III liquidity metric focused on short-term resilience. It
        asks whether eligible liquid assets are sufficient relative to stressed
        net outflows over about one month, supporting confidence that banks can
        meet obligations without disorderly fire sales.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is the Liquidity Coverage Ratio Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Liquidity risk can threaten banks even when capital ratios look strong.
        LCR encourages holdings of liquid buffers, disciplined funding
        structures, and preparedness for short-term stress scenarios that affect
        depositors, markets, and the wider financial system.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Liquidity Coverage Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>LCR = (HQLA / Expected 30-Day Net Cash Outflows) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HQLA is the eligible liquid asset stock after haircuts and caps. Net
        outflows are stressed outflows minus allowable inflows over 30 days.
      </p>

      <h2
        id="hqla"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are High-Quality Liquid Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HQLA are assets expected to remain liquid in stress. Basel-style
        frameworks group them into Level 1, Level 2A, and Level 2B with
        eligibility rules, haircuts, and composition limits (commonly Level 2 ≤
        40% and Level 2B ≤ 15% of the HQLA stock in simplified presentations).
      </p>

      <h2
        id="how-hqla"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate High-Quality Liquid Assets
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Preliminary ≈ L1 + 0.85·L2A + 0.75·L2B₂₅ + 0.50·L2B₅₀
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Then apply composition caps and other regulatory adjustments (secured
        funding unwinds, eligibility filters, jurisdictional overlays). The
        calculator’s helper is a simplified estimate only.
      </p>

      <h2
        id="net-outflows"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Expected 30-Day Net Cash Outflows?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        They combine stressed cash outflows with capped cash inflows over 30
        calendar days. A common educational simplification is Net Outflows =
        Outflows − min(Inflows, 75% × Outflows). Actual factors depend on
        liability types and the applicable rulebook.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Liquidity Coverage Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: HQLA = 1,750,000; net outflows = 1,500,000 → LCR =
        1,750,000 / 1,500,000 × 100 ≈ 116.67%.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret the LCR
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Below 100%: estimated HQLA &lt; estimated net outflows.</li>
        <li>Equal to 100%: buffers match estimated net outflows.</li>
        <li>Above 100%: buffers exceed estimated net outflows.</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Basel design contemplates that banks may use HQLA in genuine stress
        under supervisory expectations. A calculated figure alone does not
        establish a legal violation or clean bill of health.
      </p>

      <h2
        id="good-lcr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Liquidity Coverage Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Meeting or exceeding a 100% benchmark is a common reference point, but
        very high LCR can imply opportunity cost from holding lower-yielding
        liquid assets. Context, funding strategy, and local rules matter.
      </p>

      <h2
        id="basel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Basel III Liquidity Coverage Ratio Requirements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Basel Committee on Banking Supervision developed LCR as part of
        Basel III to strengthen short-term liquidity. National regulators
        implement and supervise the standard; phase-in schedules and scope can
        differ. Consult official BCBS and local supervisory publications for
        binding requirements.
      </p>

      <h2
        id="vs-nsfr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Liquidity Coverage Ratio vs. Net Stable Funding Ratio
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Feature</th>
              <th className="py-2 pr-3 font-semibold">LCR</th>
              <th className="py-2 font-semibold">NSFR</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Focus</td>
              <td className="py-2 pr-3">Short-term liquidity</td>
              <td className="py-2">Stable funding</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Horizon</td>
              <td className="py-2 pr-3">30-day stress</td>
              <td className="py-2">One-year funding</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Core idea</td>
              <td className="py-2 pr-3">HQLA vs net outflows</td>
              <td className="py-2">ASF vs RSF</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="vs-other"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LCR vs. Other Bank Liquidity Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loan-to-deposit, cash ratio, and current ratio serve different
        accounting or management purposes. They are not substitutes for the
        Basel LCR’s stress-based HQLA framework. See also{' '}
        <Link
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        .
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can Banks Improve Their LCR?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Increase eligible HQLA</li>
        <li>Reduce concentrated or runnable funding</li>
        <li>Lower expected stressed outflows</li>
        <li>Diversify funding sources</li>
        <li>Strengthen liquidity risk governance</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Liquidity Coverage Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Depends on regulatory assumptions and definitions</li>
        <li>Jurisdictional differences</li>
        <li>Market liquidity can behave differently in crises</li>
        <li>Incomplete as a sole measure of bank soundness</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/current-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Current Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cash-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cash Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/working-capital-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Working Capital Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/financial-leverage-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Financial Leverage Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/debt-to-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Debt-to-Equity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/operating-cash-flow-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Operating Cash Flow Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/free-cash-flow-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Free Cash Flow Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="lcr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LCR_FAQS]} />
      </div>
    </article>
  );
}
