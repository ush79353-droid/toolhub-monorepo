import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PE_FAQS } from './content';

export function PriceToEarningsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Price to Earnings Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The price-to-earnings (P/E) ratio compares a stock’s market price with
        earnings attributable to each common share. It answers a simple
        question: how many currency units of price are investors paying for each
        unit of reported earnings? Investors use P/E as a quick valuation
        screen, alongside industry context, growth expectations, and risk.
        Trailing P/E uses completed earnings; forward P/E uses projected
        earnings.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price/Earnings Ratio Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P/E = Price per Share ÷ Earnings per Share (EPS)</p>
        <p>Price per Share — current market price of one common share</p>
        <p>EPS — earnings attributable to each common share</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When EPS is derived rather than entered directly:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          EPS = (Net Income − Preferred Dividends) ÷ Weighted-Average Common
          Shares
        </p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the P/E Ratio
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find the current share price.</li>
        <li>Obtain EPS (or calculate it from net income, preferred dividends, and shares).</li>
        <li>Confirm EPS is positive before treating P/E as a standard multiple.</li>
        <li>Divide price by EPS.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Price per share = 120 · EPS = 10</p>
        <p>P/E = 120 / 10 = 12.00×</p>
        <p>
          Optional EPS path: NI 1,000,000 − pref 100,000 ÷ 100,000 shares → EPS
          9; price 135 → P/E = 15.00×
        </p>
      </div>

      <h2
        id="interpreting"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interpreting P/E Ratio Results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Illustrative bands (not universal rules): lower multiples (for example
        below 10) can reflect valuation, risk, or weaker growth expectations;
        mid-teens multiples are common for many mature businesses; higher
        multiples (for example above 20) often embed stronger growth
        assumptions. Zero EPS makes P/E undefined. Negative EPS makes a
        conventional multiple not meaningful. Always compare with industry
        peers, history, margins, interest rates, and accounting differences.
      </p>

      <h2
        id="trailing-vs-forward"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Trailing P/E vs. Forward P/E
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Trailing P/E</strong> uses earnings from a completed period,
        commonly the trailing twelve months. It is grounded in reported results
        but can lag turning points.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Forward P/E</strong> uses projected future earnings. It can be
        more relevant when earnings are changing quickly, but forecasts can be
        optimistic or revised sharply.
      </p>

      <h2
        id="good-pe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good P/E Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no single “good” P/E. A useful comparison weighs industry
        norms, company growth and profitability, financial stability, interest
        rates, business risk, and accounting methods. A low multiple is not
        automatically cheap, and a high multiple is not automatically expensive
        without that context.
      </p>

      <h2
        id="pe-vs-peg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        P/E Ratio vs. PEG Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P/E measures price relative to earnings. PEG divides P/E by an earnings
        growth rate (in percentage points) to relate valuation to growth. PEG
        should not be used mechanically — growth estimates can be wrong, and
        both metrics ignore many other fundamentals. See the{' '}
        <a
          href="/tools/peg-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PEG Ratio Calculator
        </a>{' '}
        for the growth-adjusted workflow.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of P/E
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Negative or near-zero earnings break standard interpretation.</li>
        <li>Cyclical earnings can distort trailing multiples.</li>
        <li>One-time gains or charges can inflate or depress EPS.</li>
        <li>Share repurchases change per-share figures without changing the business.</li>
        <li>Accounting policy differences hinder cross-company comparisons.</li>
        <li>Growth expectations and capital structure are not captured by P/E alone.</li>
        <li>Forecast-based forward P/E inherits forecast error and volatility.</li>
      </ul>

      <h2
        id="pe-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PE_FAQS]} />
      </div>
    </article>
  );
}
