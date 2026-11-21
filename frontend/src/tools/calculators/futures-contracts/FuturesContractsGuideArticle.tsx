import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUTURES_CONTRACTS_FAQS } from './content';

export function FuturesContractsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Futures Contracts Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this Futures Contracts Calculator to estimate profit or loss on a
        long or short futures trade. Choose a contract preset for ticks per
        point, enter the tick money value, buy and sell prices in points, and
        the number of contracts. Point value and P/L update as you type.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Futures P/L?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Futures P/L translates a move in the quoted price into money using the
        contract&apos;s point value. A one-point move is worth tick value times
        the number of ticks in a point. Multiplying by contracts scales the
        position.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Point Value and P/L Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Point value = Tick value × Ticks per point</p>
        <p>Number of points = Selling price − Buying price</p>
        <p>Long P/L = Points × Point value × Contracts</p>
        <p>Short P/L = − Long P/L</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select long or short.</li>
        <li>Pick a futures contract (sets ticks per point).</li>
        <li>Enter tick value and confirm ticks per point.</li>
        <li>Enter buying and selling prices in points.</li>
        <li>Enter the number of contracts and read P/L.</li>
      </ol>

      <h2
        id="contracts"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Contract Presets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Presets reuse the shared Omega futures catalog also used by the Margin
        Call Calculator: E-Mini S&amp;P 500 (4), Micro E-Mini S&amp;P 500 (4),
        E-Mini Nasdaq-100 (4), E-Mini Dow (1), Crude Oil (100), Gold (10), and
        Custom. Tick money is not a live exchange feed — enter the value you want
        to model.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Long Micro E-Mini S&amp;P 500 · tick <strong>1.25</strong> ·{' '}
        <strong>4</strong> ticks/point · buy <strong>4500</strong> · sell{' '}
        <strong>4510</strong> · <strong>2</strong> contracts → point value{' '}
        <strong>5</strong> · <strong>10</strong> points · P/L{' '}
        <strong>100</strong> in the tick currency.
      </p>

      <h2
        id="currency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Currencies and FX
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tick value, point-value display, and P/L each have independent currency
        selectors. Math runs in the tick currency; displays convert through
        Omega&apos;s stored FX snapshot (ADR-021). Missing rates block conversion
        instead of assuming 1:1. Quote prices and ticks per point never convert.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>No commissions, fees, slippage, or overnight financing.</li>
        <li>No margin or account equity simulation (see Margin Call).</li>
        <li>Tick amounts are user inputs, not live CME settlements.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/margin-call-calculator" className="text-primary">
            Margin Call Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/call-option-calculator" className="text-primary">
            Call Option Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/black-scholes-calculator"
            className="text-primary"
          >
            Black Scholes Calculator
          </Link>
        </li>
      </ul>

      <div id="fc-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...FUTURES_CONTRACTS_FAQS]} />
        </div>
      </div>
    </article>
  );
}
