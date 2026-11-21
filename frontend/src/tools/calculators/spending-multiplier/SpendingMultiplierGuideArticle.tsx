import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SPENDING_MULTIPLIER_FAQS } from './content';

export function SpendingMultiplierGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Spending Multiplier Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Keynesian spending multiplier connects the marginal propensity to
        consume (MPC), the marginal propensity to save (MPS), and the change in
        equilibrium aggregate output that follows an autonomous spending
        impulse. This calculator derives k = 1/(1−MPC) = 1/MPS, estimates
        theoretical ΔY = k×ΔA, solves for required autonomous spending, and
        visualizes a finite number of spending rounds. Results are educational
 model outputs; not guaranteed GDP forecasts. Currency selection is
        denomination only (not FX conversion).
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Spending Multiplier?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An initial rise in autonomous spending raises incomes for the recipients
        of that spending. Those recipients consume a fraction MPC of the extra
        income, generating further rounds of demand. The sum of the infinite
 geometric series of rounds is the multiplier times the initial impulse; 
        provided MPC is below 1 so the series converges.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Spending Multiplier Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>k = 1 / (1 − MPC)</p>
        <p>k = 1 / MPS</p>
        <p>MPC + MPS = 1</p>
        <p>ΔY = k × ΔA</p>
        <p>ΔA = ΔY / k</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The two expressions for k are equivalent when MPC + MPS = 1. If MPC = 1
 (MPS = 0), the simple multiplier is undefined/unbounded; this tool never
        displays Infinity.
      </p>

      <h2
        id="mpc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Marginal Propensity to Consume?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        MPC = ΔC / ΔYd
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: additional disposable income $1,000 and additional consumption
        $800 → MPC = 0.8. For consumption-function tools, see the{' '}
        <Link
          href="/tools/mpc-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          MPC Calculator
        </Link>
        .
      </p>

      <h2
        id="mps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Marginal Propensity to Save?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        MPS = ΔS / ΔYd
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: additional income $1,000 and additional saving $200 → MPS =
        0.2. Saving is the leakage that limits successive spending rounds in the
        basic model.
      </p>

      <h2
        id="mpc-mps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Relationship Between MPC and MPS
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When additional disposable income is split only between consumption and
        saving, MPC + MPS = 1. Entering MPC updates MPS (and conversely) in this
        calculator so the identity stays consistent under the chosen solve mode.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Spending Multiplier
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Take MPC = 0.75.</li>
        <li>Compute 1 − MPC = 0.25 (= MPS).</li>
        <li>k = 1 / 0.25 = 4.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Spending Multiplier Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MPC = 0.8, MPS = 0.2, autonomous spending increase = $10 million → k = 5
        and theoretical ΔY = 5 × $10 million = $50 million. That figure is a
        model result, not a guaranteed economic outcome.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Spending Multiplier Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With MPC = 0.6 and initial spending $1,000: Round 0 adds $1,000; Round 1
        adds $600; Round 2 adds $360; and so on. The infinite sum equals $2,500 =
        ΔA/(1−MPC). The calculator shows a finite number of rounds and compares
 the partial total with the theoretical limit, without an unbounded loop.
      </p>

      <h2
        id="gdp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Spending Multiplier and GDP
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Textbooks use the multiplier to map autonomous expenditure shocks into
        equilibrium output. Distinguishing real GDP from nominal GDP matters for
        interpretation: the simple multiplier does not automatically incorporate
        price-level responses. Optional “observed GDP change” fields here are
        user comparisons, not data the model claims to observe.
      </p>

      <h2
        id="vs-money"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Spending Multiplier vs. Money Multiplier
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 font-semibold text-accent">Aspect</th>
              <th className="px-3 py-2 font-semibold text-accent">
                Spending multiplier
              </th>
              <th className="px-3 py-2 font-semibold text-accent">
                Money multiplier
              </th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="px-3 py-2">Core ratio</td>
              <td className="px-3 py-2">MPC / MPS</td>
              <td className="px-3 py-2">Reserve / deposit ratios</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">Asks</td>
              <td className="px-3 py-2">Output from spending shocks</td>
              <td className="px-3 py-2">Deposits from reserves</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Related tool</td>
              <td className="px-3 py-2">This calculator</td>
              <td className="px-3 py-2">
                <Link
                  href="/tools/money-multiplier-calculator"
                  className="text-primary hover:underline"
                >
                  Money Multiplier
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="government"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Government Spending Multiplier
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Government purchases can serve as the autonomous impulse ΔA. The
        textbook purchases multiplier equals 1/(1−MPC) in the simplest setting.
        Empirical fiscal multipliers vary with monetary accommodation, openness,
 and spare capacity; do not equate textbook k with every stimulus
        estimate.
      </p>

      <h2
        id="investment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Investment Multiplier
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A rise in investment demand is another common autonomous spending
        change. In the same simplified framework it is scaled by the same k,
        subject to the same caveats about interest rates, expectations, and
        capacity.
      </p>

      <h2
        id="tax"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Multiplier
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        k_T = −MPC / (1 − MPC)
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The simple lump-sum tax multiplier is smaller in magnitude than the
        purchases multiplier and rests on restrictive assumptions. This
        calculator does not auto-apply tax-policy packages to real economies.
      </p>

      <h2
        id="what-affects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Affects the Size of the Spending Multiplier?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>MPC and MPS (and other leakages such as taxes and imports).</li>
        <li>Interest rates and monetary policy responses.</li>
        <li>Spare productive capacity and inflation pressures.</li>
        <li>Consumer and business expectations and confidence.</li>
        <li>Time horizon of the measured impulse response.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Spending Multiplier
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Closed-economy / constant-propensity simplifications.</li>
        <li>Price rigidity and unused capacity assumptions.</li>
        <li>Crowding out, import leakage, and tax leakages.</li>
        <li>Wide uncertainty in empirical multiplier estimates.</li>
      </ul>

      <h2
        id="when-useful"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Is the Spending Multiplier Useful?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It remains valuable for economics education, introductory macro
 scenarios, and structured discussion of fiscal or investment impulses; 
        provided users separate classroom arithmetic from forecasts.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose whether MPC, MPS, or the multiplier is the primary input.</li>
        <li>Optionally enter autonomous spending or a target ΔY.</li>
        <li>Compare an optional observed GDP change with the theoretical ΔY.</li>
        <li>Inspect finite spending rounds and calculation steps.</li>
        <li>Reload restores MPC 0.6 / ΔA 1,000,000; Clear empties fields.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/mpc-calculator" className="text-primary hover:underline">
            MPC Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/money-multiplier-calculator" className="text-primary hover:underline">
            Money Multiplier Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/money-supply-calculator" className="text-primary hover:underline">
            Money Supply Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gdp-growth-rate-calculator" className="text-primary hover:underline">
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/real-gdp-calculator" className="text-primary hover:underline">
            Real GDP Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/inflation-calculator" className="text-primary hover:underline">
            Inflation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="spending-multiplier-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...SPENDING_MULTIPLIER_FAQS]} />
      </div>
    </article>
  );
}
