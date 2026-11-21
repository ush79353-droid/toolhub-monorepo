import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { UB_FAQS } from './content';

export function UnleveredBetaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Unlevered Beta?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unlevered beta (asset beta) estimates the systematic risk of a
        company&apos;s underlying business after adjusting equity beta for
        financial leverage. Investors and analysts separate business risk from
        financing risk so they can compare peers with different debt levels and
        build valuation models under target capital structures. Unlevered beta
        is model-dependent — not a guaranteed measure of every investment risk.
      </p>

      <h2
        id="levered-vs-unlevered"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Levered Beta vs. Unlevered Beta
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-semibold text-accent">Feature</th>
              <th className="py-2 pr-3 font-semibold text-accent">Levered</th>
              <th className="py-2 font-semibold text-accent">Unlevered</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Also called</td>
              <td className="py-2 pr-3">Equity beta</td>
              <td className="py-2">Asset beta</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Financial leverage</td>
              <td className="py-2 pr-3">Reflected</td>
              <td className="py-2">Adjusted out</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Main focus</td>
              <td className="py-2 pr-3">Equity systematic risk</td>
              <td className="py-2">Business systematic risk</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Common use</td>
              <td className="py-2 pr-3">Cost of equity / CAPM</td>
              <td className="py-2">Peer comparison &amp; relevering</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unlevered Beta Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>βU = βL / [1 + (1 − T) × (D/E)]</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        βL is levered equity beta, T is the corporate tax rate as a decimal, and
        D/E is the debt-to-equity ratio. The (1 − T) term reflects a simplified
        interest tax-shield assumption in the Hamada relationship. Debt beta is
        assumed near zero — other models relax that assumption.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Unlevered Beta
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Estimate tax rate T (from income or enter manually).</li>
        <li>Compute D/E = total debt ÷ shareholders&apos; equity.</li>
        <li>Enter levered equity beta βL.</li>
        <li>Apply βU = βL / [1 + (1 − T)(D/E)].</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NI 80,000 · Pre-tax 100,000 → T = 20%</p>
        <p>Debt 2,000,000 · Equity 1,000,000 → D/E = 2.00×</p>
        <p>βL = 1.20 → βU = 1.20 / 2.60 ≈ 0.4615</p>
      </div>

      <h2
        id="levered-beta"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Levered Beta?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Levered beta measures equity return sensitivity to market moves and
        embeds financial leverage. Estimates vary with lookback windows,
        frequency, and market indexes. Related:{' '}
        <Link
          href="/tools/portfolio-beta-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Portfolio Beta Calculator
        </Link>
        .
      </p>

      <h2
        id="debt-equity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Debt-to-Equity Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        D/E compares interest-bearing debt to equity. Valuation often prefers
        market-value weights; accounting book equity is common on statements.
        Keep debt and equity definitions consistent. See the{' '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt-to-Equity Ratio Calculator
        </Link>
        .
      </p>

      <h2
        id="tax-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Corporate Tax Rate in Unlevered Beta
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Effective tax rates from accounting income can differ from statutory or
        normalized rates used in valuation. Interest tax deductibility motivates
        the (1 − T) term in the Hamada formula. Choose the rate that matches your
        model. Related:{' '}
        <Link
          href="/tools/effective-corporate-tax-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Effective Corporate Tax Rate Calculator
        </Link>
        .
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Unlevered Beta
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Below 1 — lower estimated positive market sensitivity.</li>
        <li>Near 1 — market-like estimated business sensitivity.</li>
        <li>Above 1 — higher estimated positive sensitivity.</li>
        <li>Negative — inverse estimated linear sensitivity.</li>
        <li>Near zero — little estimated linear market sensitivity.</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Beta does not capture liquidity risk, idiosyncratic risk, or all paths to
        loss. Low beta is not automatically “safe.”
      </p>

      <h2
        id="importance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Unlevered Beta Important?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Company valuation and peer comps.</li>
        <li>Estimating business risk across capital structures.</li>
        <li>Cost of capital and capital budgeting inputs.</li>
        <li>Financial modeling and leverage scenario analysis.</li>
      </ol>

      <h2
        id="relever"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Relever Beta
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>βL = βU × [1 + (1 − T) × (D/E)]</p>
        <p>Example: βU 0.4615 · T 20% · target D/E 2 → βL ≈ 1.20</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Relevering applies a target capital structure after estimating an
        industry or peer unlevered beta.
      </p>

      <h2
        id="capm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unlevered Beta and CAPM
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Re = Rf + βL × (Rm − Rf)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CAPM uses levered equity beta. Analysts may unlever peer betas, average
        them, relever to the subject firm, then plug βL into CAPM. See the{' '}
        <Link
          href="/tools/capm-calculator-capital-asset-pricing-model"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CAPM Calculator
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/cost-of-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cost of Equity Calculator
        </Link>
        .
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Unlevered Beta
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Historical estimation, changing markets and leverage, debt-beta
        assumptions, tax-rate differences, book versus market measures, industry
        variation, estimation error, nonlinear exposures, negative equity, and
        methodology differences all limit precision. Treat unlevered beta as an
        analytical estimate.
      </p>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Practical Applications
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          A: Firm A βL 1.4 · T 25% · D/E 1 → βU ≈ 0.8000; Firm B βL 1.1 · T 25% ·
          D/E 0.2 → βU ≈ 0.9565 — compare operating risk carefully.
        </p>
        <p>
          B: Peer βU ≈ 0.70 · private target D/E 0.5 · T 25% → βL ≈ 0.9625 for
          CAPM.
        </p>
        <p>
          C: Industry βU 0.85 · proposed D/E 1.5 · T 20% → βL ≈ 1.87 under the
          Hamada relever.
        </p>
      </div>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/portfolio-beta-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Portfolio Beta Calculator
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
            href="/tools/debt-to-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Debt-to-Equity Ratio Calculator
          </Link>
        </li>
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
            href="/tools/financial-leverage-ratio-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Financial Leverage Ratio Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/return-on-equity-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Return on Equity Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/dupont-analysis-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            DuPont Analysis Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/enterprise-value-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Enterprise Value Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ub-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...UB_FAQS]} />
      </div>
    </article>
  );
}
