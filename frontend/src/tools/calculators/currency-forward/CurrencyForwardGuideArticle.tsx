import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CURRENCY_FORWARD_FAQS } from './content';

export function CurrencyForwardGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Currency Forward Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A currency forward is an agreement to exchange one currency for another
        at a predetermined rate on a future date. This calculator estimates a
        theoretical forward exchange rate from the spot rate, interest rates on
        both currencies, contract duration, and a compounding convention —
        using covered interest rate parity (CIP). Businesses and investors use
        forwards to hedge FX exposure or to price interest-rate differentials.
        Results are parity-based estimates, not executable dealer quotations.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Currency Forward Contract?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A forward exchange agreement locks a rate for settlement on a future
        date. Parties specify base and quote currencies, notional amounts, the
        contracted rate, and maturity. Forwards are typically over-the-counter
        (OTC) and can be customized. The contractual rate is what counterparties
        agree to; the theoretical rate from this tool is a CIP benchmark that
        may differ from actual market quotes because of spreads, basis, credit,
        and funding conditions.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Currency Forward Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: a U.S. importer must pay a EUR invoice in 90 days. Today&apos;s
        spot is uncertain for that future payment. By entering a forward to buy
        EUR (sell USD) at a locked rate, the firm reduces cash-flow uncertainty.
        At maturity, settlement occurs at the contracted rate regardless of the
        then-current spot (subject to contract and credit terms).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency Forward Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Quote convention: BASE/QUOTE = units of quote currency per one unit of
        base. Under simple interest CIP:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>F = S × (1 + rq T) / (1 + rb T)</p>
        <p>S = spot (quote per 1 base)</p>
        <p>rq = annual quote-currency rate · rb = annual base-currency rate</p>
        <p>T = year fraction (e.g. days / 365)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The numerator accumulates the quote currency; the denominator accumulates
        the base. Annual compounding uses (1+r)^T; continuous uses e^((rq−rb)T).
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Currency Forward Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative EUR/USD example (hypothetical, not a live quote): S =
        1.1000 USD per EUR · USD rate 5% · EUR rate 3% · 90 days · Actual/365 ·
        simple interest.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>T = 90/365 ≈ 0.246575</p>
        <p>USD period ≈ 0.05 × T ≈ 1.2329%</p>
        <p>EUR period ≈ 0.03 × T ≈ 0.7397%</p>
        <p>F ≈ 1.1000 × (1.012329)/(1.007397) ≈ 1.1054 USD per EUR</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Because the USD interest rate exceeds the EUR rate, the USD-per-EUR
        forward is higher than spot under these assumptions.
      </p>

      <h2
        id="cip"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Covered Interest Rate Parity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CIP is a no-arbitrage principle linking spot, forward, and interest
        rates: borrowing in one currency, investing in the other, and covering
        with a forward should not yield risk-free profit when markets are
        frictionless. Real markets deviate because of cross-currency basis,
        funding constraints, bid-ask spreads, credit, and transaction costs.
      </p>

      <h2
        id="premium"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency Forward Premium and Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Forward points = F − S. Premium % = (F/S − 1)×100. Positive means the
        base currency trades at a forward premium in quote terms (F &gt; S);
        negative is a forward discount. A simple annualized premium divides by
        T. Forward premium is not a guaranteed investment return.
      </p>

      <h2
        id="spot-vs-forward"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Spot Exchange Rate vs. Forward Exchange Rate
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-foreground/90">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Topic</th>
              <th className="py-2 pr-3 font-semibold">Spot</th>
              <th className="py-2 font-semibold">Forward</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Definition</td>
              <td className="py-2 pr-3">Current market exchange rate</td>
              <td className="py-2">Agreed rate for future delivery</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Settlement</td>
              <td className="py-2 pr-3">Near-term (T+0/T+1/T+2)</td>
              <td className="py-2">On the forward maturity date</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Pricing</td>
              <td className="py-2 pr-3">Supply and demand today</td>
              <td className="py-2">Interest differential + market factors</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Certainty</td>
              <td className="py-2 pr-3">Locks only for spot settlement</td>
              <td className="py-2">Locks a future exchange rate</td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3 font-medium">Uses</td>
              <td className="py-2 pr-3">Immediate conversion</td>
              <td className="py-2">Hedging, pricing, speculation</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium">Risks</td>
              <td className="py-2 pr-3">Future rates remain open</td>
              <td className="py-2">Counterparty, opportunity cost</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="vs-futures"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency Forward vs. Currency Futures
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Forwards: OTC, customizable terms, bilateral credit risk</li>
        <li>Futures: exchange-traded, standardized, cleared and margined</li>
        <li>Liquidity and settlement processes differ by venue</li>
      </ul>

      <h2
        id="vs-options"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currency Forward vs. Currency Option
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A forward is an obligation to exchange at F. An option is a right (not
        obligation) purchased for a premium — it can protect downside while
        allowing participation in favorable moves, at the cost of the premium.
      </p>

      <h2
        id="business-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Businesses Use Currency Forward Contracts
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Importers hedge payables; exporters hedge receivables; firms managing
        foreign-currency debt, overseas investments, or international suppliers
        use forwards to stabilize budgeted cash flows in their reporting
        currency.
      </p>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Hedging, Speculation, and Arbitrage
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Currency Hedging</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lock a future rate so adverse FX moves have less impact on planned
        invoices or revenues.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Currency Speculation</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Take a directional position via forwards; profits and losses depend on
        where spot settles relative to F.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Currency Arbitrage</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Covered interest arbitrage seeks risk-free profit from CIP gaps after
        funding, access, and transaction-cost constraints — often unavailable
        once frictions are included.
      </p>

      <h2
        id="determinants"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Determines Currency Forward Prices?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Spot exchange rate and interest-rate differential</li>
        <li>Maturity, compounding, and day-count conventions</li>
        <li>Cross-currency basis, funding costs, liquidity, bid-ask spreads</li>
      </ul>

      <h2
        id="risks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Risks of Currency Forward Contracts
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Counterparty credit and settlement risk</li>
        <li>Liquidity and collateral/funding requirements</li>
        <li>Opportunity cost if spot moves favorably after hedging</li>
        <li>Market risk on speculative (unhedged) positions</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Currency Forward Calculator
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Theoretical CIP pricing — may not match dealer quotes</li>
        <li>Assumes entered rates suit the chosen maturity</li>
        <li>No automatic spreads, basis, or transaction costs</li>
        <li>Does not predict future spot exchange rates</li>
        <li>Manual inputs only — no fabricated live FX or policy rates</li>
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
            href="/tools/carry-trade-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Carry Trade Calculator
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
            href="/tools/cpi-inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            CPI Inflation Calculator
          </Link>
        </li>
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
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="currency-forward-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CURRENCY_FORWARD_FAQS]} />
      </div>
    </article>
  );
}
