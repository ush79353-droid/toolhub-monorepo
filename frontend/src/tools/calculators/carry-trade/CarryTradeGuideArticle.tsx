import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CARRY_TRADE_FAQS } from './content';

export function CarryTradeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Carry Trade Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates the potential return or loss from a currency
        carry trade by combining the interest-rate differential with exchange-rate
        changes over the holding period. Investors use carry strategies to earn
        yield gaps between currencies, but foreign-exchange moves can dominate the
        outcome — so both must be evaluated together. Results are estimates under
        manual inputs, not guaranteed trading profits.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Carry Trade?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A carry trade borrows in a lower-interest funding currency, converts into
        a higher-yielding investment currency, earns interest, and later converts
        back to repay the loan. Example: borrow Currency A at 2%, convert to
        Currency B earning 6%, hold for a period, then reverse the FX trade and
        repay A. Gains come from interest and favorable FX; losses arise when the
        investment currency depreciates or funding costs rise.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Currency Carry Trade Work?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Borrow the funding currency (principal P).</li>
        <li>Convert at the initial exchange rate S₀.</li>
        <li>Invest in a higher-yielding instrument.</li>
        <li>Earn lending interest over D days.</li>
        <li>Convert proceeds back at settlement rate S₁.</li>
        <li>Repay funding principal plus borrowing interest.</li>
        <li>Profit or loss is the funding-currency residual.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Carry Trade Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Quote: S = investment currency per 1 funding unit</p>
        <p>Rl = rl × D/B · Rb = rb × D/B (simple interest)</p>
        <p>Profit = P × [(S₀/S₁)×(1+Rl) − (1+Rb)]</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The simplified approximation d + Rl − Rb is shown for education only. It
        omits the interaction between exchange-rate movement and lending interest
        and is not generally identical to the cash-flow return.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Carry Trade Profit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative inputs (hypothetical, not live quotes): P = 5,000 · S₀ =
        0.85 · S₁ = 0.83 · rl = 6% · rb = 2% · D = 180 · B = 365.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>d = (0.85/0.83 − 1)×100 ≈ +2.41%</p>
        <p>Rl ≈ 2.9589% · Rb ≈ 0.9863% · net ≈ +1.97%</p>
        <p>V = 5000×(0.85/0.83)×(1+Rl) ≈ 5,271.99</p>
        <p>Repay = 5000×(1+Rb) ≈ 5,049.32</p>
        <p>Profit ≈ +222.68 · total return ≈ +4.45%</p>
      </div>

      <h2
        id="spot-differential"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Spot Rate Differential?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The spot differential measures conversion-value change between opening and
        closing rates. Under this convention d% = (S₀/S₁ − 1)×100. A falling S₁
        (investment currency stronger in these units) raises d and tends to help
        profit; a rising S₁ hurts. Direct vs indirect quotes reverse formulas if
        the convention is flipped — never leave direction ambiguous.
      </p>

      <h2
        id="lending-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Lending Rate in a Carry Trade?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The lending rate is the annual yield earned on the investment currency.
        Period return uses simple interest Rl = rl × D/B. Money markets may use
        360- or 365-day conventions; this tool makes the basis explicit and does
        not silently compound.
      </p>

      <h2
        id="borrowing-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Borrowing Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The borrowing rate is the funding cost on the loan in the funding
        currency. Period cost Rb = rb × D/B feeds the repayment P×(1+Rb). Funding
        costs can change on rollover; this static model uses a single entered rate.
      </p>

      <h2
        id="interest-vs-fx"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interest Rate Differential vs. Exchange Rate Risk
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A positive interest differential does not guarantee profit. If the
        investment currency depreciates enough, S₀/S₁ falls and can erase the
        interest advantage — the calculator will show a loss even when Rl &gt; Rb.
      </p>

      <h2
        id="risks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are the Main Risks of Carry Trading?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Currency and volatility risk</li>
        <li>Interest-rate and funding-rollover risk</li>
        <li>Liquidity, leverage, and margin-call risk</li>
        <li>Counterparty, political, and economic shocks</li>
        <li>Transaction costs and crowded-trade unwind risk</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Leveraged carry trades can lose more than posted collateral.
      </p>

      <h2
        id="central-banks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do Central Bank Interest Rates Affect Carry Trades?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monetary policy shapes funding and investment yields and can influence
        capital flows and currencies. Rate expectations matter, but no policy
        decision is a guaranteed predictor of exchange rates.
      </p>

      <h2
        id="positive-negative"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive vs. Negative Carry Trade
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive interest carry means Rl &gt; Rb; negative means Rb &gt; Rl.
        Distinguish interest carry from total realized cash-flow return, which also
        embeds FX.
      </p>

      <h2
        id="profitable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Carry Trading Profitable?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Profitability depends on the interest gap, FX path, financing conditions,
        costs, and leverage. Calm markets with stable high-yield currencies can
        favor carry; stress and sudden unwinds can reverse years of gains quickly.
      </p>

      <h2
        id="vs-forex"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Carry Trade vs. Forex Trading
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Carry focuses on earning the yield differential over a holding period;
        short-term FX trading focuses on directional price moves. The approaches
        overlap when traders also seek FX appreciation on top of carry.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Carry Trade Calculator
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>No commissions, spreads, slippage, or taxes</li>
        <li>No broker financing markups or margin requirements</li>
        <li>Single fixed rates — no daily resets or path-dependent FX</li>
        <li>No forward premiums, hedges, or country settlement rules</li>
        <li>Manual exchange rates only — not live market feeds</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Outputs are estimates for education and scenario analysis, not guaranteed
        profits.
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
            href="/tools/interest-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Interest Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/simple-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Simple Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/roi-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/apr-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            APR Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="carry-trade-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CARRY_TRADE_FAQS]} />
      </div>
    </article>
  );
}
