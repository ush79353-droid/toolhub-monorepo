import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MPC_FAQS } from './content';

export function MpcGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        MPC Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The marginal propensity to consume (MPC) measures how much consumer
        spending changes when disposable income changes. This calculator computes
        MPC from ΔC and ΔYd (or accepts MPC directly), then builds the linear
        consumption function C = a + MPC × Yd, plots the consumption line, and
        reports MPS, a simplified Keynesian spending multiplier, and break-even
        disposable income. Use it to learn macro relationships — not as a
        forecast of any household’s next paycheck.
      </p>

      <h2
        id="what-is-mpc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Marginal Propensity to Consume (MPC)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Disposable income is income after taxes and transfers in the context you
        are modeling. Consumer spending is consumption outlays. MPC asks: of an
        extra dollar of disposable income, how many cents show up as extra
        consumption over the measured interval? If spending rises by $600 when
        disposable income rises by $1,000, MPC = 0.6. Households may save the
        rest, repay debt, or hold cash — the simple model summarizes the
        residual as saving via MPS = 1 − MPC.
      </p>

      <h2
        id="consumption-function"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Consumption Function?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        C = a + b × Yd
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Autonomous consumption a is the intercept (predicted C when Yd = 0). The
        slope b is MPC. Total consumer spending C rises linearly with disposable
        income Yd in this teaching model. On a graph, a higher MPC steepens the
        line; a higher a shifts it upward.
      </p>

      <h2
        id="mpc-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Marginal Propensity to Consume Formula — How to Calculate MPC
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        MPC = ΔC / ΔYd
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: ΔC = $600 and ΔYd = $1,000 → MPC = 0.60 (60%). If autonomous
        consumption is $18,000 and disposable income is $40,000, then C = 18,000
        + 0.6 × 40,000 = $42,000. MPS = 0.40 and the simplest multiplier is 2.50.
        Break-even income where C = Yd is 18,000 / 0.4 = $45,000.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the MPC Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose mode: derive MPC from changes, or enter MPC directly.</li>
        <li>Enter ΔYd and ΔC (or MPC).</li>
        <li>Enter autonomous consumption and disposable income.</li>
        <li>Read MPC, consumer spending, MPS, multiplier, and break-even.</li>
        <li>Explore the consumption function graph (optional 45° line).</li>
      </ol>

      <h2
        id="calculate-spending"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Consumer Spending
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plug values into C = a + MPC × Yd. Example variants: a = 10,000, MPC =
        0.75, Yd = 20,000 → C = 25,000. Or a = 0, MPC = 0.9, Yd = 50,000 → C =
        45,000. The calculator updates C whenever a, MPC, or Yd changes.
      </p>

      <h2
        id="mpc-vs-apc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPC vs. APC — What&apos;s the Difference?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        APC = C / Yd
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APC is average propensity to consume. With positive autonomous
        consumption, APC typically exceeds MPC at low incomes and falls toward
        MPC as income rises along a linear consumption function.
      </p>

      <h2
        id="mpc-vs-mps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPC vs. MPS
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Marginal propensity to save uses MPS = 1 − MPC when income changes are
        partitioned only into consumption and saving. Real households also repay
        debt, buy assets, or face timing mismatches — treat MPS as a simplified
        residual.
      </p>

      <h2
        id="good-mpc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good MPC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no single good value. Liquidity-constrained households often
        show higher MPCs; wealthier households may consume less of an income
        windfall. Credit access, inflation, and confidence all matter. Policy
        analysis should use context-specific estimates rather than a universal
        constant.
      </p>

      <h2
        id="mpc-gt-one"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can MPC Be Greater Than One?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes in data: spending can rise more than measured disposable income if
        households borrow, sell assets, or if income and spending are misaligned
        in time. Example: ΔC = $1,200 and ΔYd = $1,000 → MPC = 1.2. The
        calculator warns instead of clamping.
      </p>

      <h2
        id="mpc-negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can MPC Be Negative?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Observed ΔC and ΔYd can move oppositely (ΔC = −200, ΔYd = 1,000 → MPC =
        −0.2). That is unusual relative to textbook assumptions but possible;
        distinguish empirical quirks from the standard 0–1 teaching range.
      </p>

      <h2
        id="multiplier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MPC and the Keynesian Multiplier
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        k = 1 / (1 − MPC)
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In the simplest closed economy without taxes or imports, induced
        consumption amplifies autonomous spending by k. Saving is the leakage
        that caps the geometric series. Real multipliers are reduced by taxes,
        imports, capacity constraints, and monetary offsets. At MPC = 1 the
        simplified k is undefined — this tool never shows Infinity.
      </p>

      <h2
        id="macro"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Macroeconomic Implications of MPC
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aggregate consumption is a large share of demand in many economies. MPC
        shapes how income shocks and transfers feed into spending, GDP, and
        simple fiscal multipliers. Consumer confidence and credit conditions can
        shift effective MPCs over the cycle.
      </p>

      <h2
        id="policy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Government Policies Affect Consumption
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tax cuts, tax increases, transfers, and stimulus change disposable
        income and expectations. The consumption response is often summarized
        with an MPC, but the applicable MPC depends on who receives the funds
        and whether the change is seen as temporary or permanent. Do not treat
        one fixed MPC as universal policy truth.
      </p>

      <h2
        id="forecasting"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why MPC Matters in Economic Forecasting
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Forecasters use consumption–income links to gauge demand, growth, fiscal
        impulse, and recession risk. Estimated MPCs inform scenario analysis —
        always with uncertainty bands and competing models.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the MPC Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MPC can change over time and across households. Credit constraints,
        expectations, inflation, and short-run vs long-run behavior all matter.
        One observed income–spending pair does not establish causality. The
        linear function and simple multiplier are teaching tools with known
        ceilings.
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
            href="/tools/money-multiplier-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Money Multiplier Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/money-supply-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Money Supply Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/discretionary-income-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Discretionary Income Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-growth-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-gap-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Gap Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/cpi-inflation-calculator-consumer-price-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CPI Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/buying-power-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Buying Power Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-equation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Equation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="mpc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MPC_FAQS]} />
      </div>
    </article>
  );
}
