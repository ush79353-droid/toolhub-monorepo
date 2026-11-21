import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WACC_FAQS } from './content';

export function WaccGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is WACC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weighted average cost of capital (WACC) estimates the blended required
        return of a company&apos;s capital providers — typically equity and
        interest-bearing debt — under a specified capital structure. It reflects
        opportunity cost of capital and is expressed as a percentage. Companies
        use WACC in investment appraisal and firm valuation when financing and
        risk assumptions are sufficiently comparable.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WACC Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>WACC = (E/(E+D))×Re + (D/(E+D))×Rd×(1−T)</p>
        <p>We = E/(E+D) · Wd = D/(E+D)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        E and D are capital values, Re is cost of equity, Rd is pre-tax cost of
        debt, and T is the tax rate. Equity and debt weights should sum to 100%.
        Preferred stock or hybrids require an expanded formula.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate WACC
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Alpha Ltd: E 700,000 · D 500,000 · Re 15% · Rd 8% · T 20%</p>
        <p>V = 1,200,000 · We ≈ 58.33% · Wd ≈ 41.67%</p>
        <p>Rd(1−T) = 6.40%</p>
        <p>Equity contrib. 8.75% · Debt contrib. ≈ 2.67% → WACC ≈ 11.42%</p>
      </div>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Sum equity and debt for total capital.</li>
        <li>Compute equity and debt weights.</li>
        <li>Compute after-tax cost of debt.</li>
        <li>Weight each cost and add the contributions.</li>
      </ol>

      <h2
        id="cost-of-equity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Cost of Equity?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Re = Rf + β × (Rm − Rf)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost of equity is the return shareholders require for equity risk. CAPM
        is a common estimate; inputs vary. See the{' '}
        <Link
          href="/tools/cost-of-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cost of Equity Calculator
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/capm-calculator-capital-asset-pricing-model"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CAPM Calculator
        </Link>
        .
      </p>

      <h2
        id="cost-of-debt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Cost of Debt?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost of debt is the pre-tax borrowing cost, preferably from current
        market yields rather than outdated coupons. After-tax cost is Rd×(1−T)
        when interest is deductible. Related:{' '}
        <Link
          href="/tools/after-tax-cost-of-debt-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          After-Tax Cost of Debt Calculator
        </Link>
        .
      </p>

      <h2
        id="tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Tax Affect WACC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Deductible interest lowers the effective debt cost via (1−T). Tax losses
        or interest-limitation rules can reduce the shield. Marginal rates are
        often preferred over accounting effective rates for forward-looking WACC.
        Example: same 50/50 mix · Re 12% · Rd 8% → with T 0% WACC = 10%; with T
        25% WACC = 9%.
      </p>

      <h2
        id="market-values"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Are Market Values Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market equity (e.g., market cap) and market debt better reflect current
        opportunity costs than historical book values. Book figures remain a
        common approximation when market debt is unavailable — disclose the
        limitation.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret WACC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher WACC often means higher required returns (more risk or costlier
        financing). Lower WACC can reflect cheaper capital or lower perceived
        risk. Industry norms and project risk matter more than a universal
        “good” percentage.
      </p>

      <h2
        id="investment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WACC and Investment Decisions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        WACC supports capital budgeting, DCF valuation, hurdle rates, and capital
        structure analysis. Match the discount rate to project risk — a riskier
        project may need a rate above firm WACC.
      </p>

      <h2
        id="dcf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WACC in Discounted Cash Flow Valuation
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EV = Σ FCFFₜ/(1+WACC)ᵗ + TVₙ/(1+WACC)ⁿ</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        WACC commonly discounts free cash flow to the firm when financing and
        risk assumptions are consistent. Related:{' '}
        <Link
          href="/tools/npv-calculator-net-present-value"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          NPV Calculator
        </Link>
        .
      </p>

      <h2
        id="vs-coe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WACC vs. Cost of Equity
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">WACC</th>
              <th className="py-2 font-semibold text-accent">Cost of Equity</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Providers</td>
              <td className="py-2 pr-3">Debt + equity</td>
              <td className="py-2">Equity only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Tax effect</td>
              <td className="py-2 pr-3">After-tax debt cost</td>
              <td className="py-2">No debt tax shield</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Typical use</td>
              <td className="py-2 pr-3">FCFF / firm DCF</td>
              <td className="py-2">Equity cash flows / CAPM</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="vs-irr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WACC vs. IRR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        IRR is a project return metric; WACC is a financing cost / hurdle
        estimate. Comparing them requires aligned risk and cash-flow definitions.
        See the{' '}
        <Link
          href="/tools/irr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          IRR Calculator
        </Link>
        .
      </p>

      <h2
        id="drivers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects WACC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest rates, creditworthiness, equity risk premiums, beta, debt
        levels, capital structure, tax rates, economic conditions, and industry
        characteristics all influence WACC.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of WACC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimated costs of capital, changing structure, uncertain equity cost,
        market-value estimation, tax-shield assumptions, hybrids, distress,
        project-specific risk, currency consistency, and nominal/real or tax
        cash-flow mismatches all limit WACC. It is a model estimate — not a
        guaranteed investment return.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/cost-of-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cost of Equity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/after-tax-cost-of-debt-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            After-Tax Cost of Debt Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/capm-calculator-capital-asset-pricing-model"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CAPM Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/unlevered-beta-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Unlevered Beta Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/debt-to-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Debt-to-Equity Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/roic-calculator-return-on-invested-capital"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            ROIC Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/economic-value-added-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Economic Value Added Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/irr-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            IRR Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/npv-calculator-net-present-value"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            NPV Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="wacc-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...WACC_FAQS]} />
      </div>
    </article>
  );
}
