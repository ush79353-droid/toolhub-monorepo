import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EPS_FAQS } from './content';

export function EarningsPerShareGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="intro"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Introduction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Earnings per Share Calculator helps investors and analysts express
        company profitability on a per common share basis. EPS supports stock
        analysis, earnings comparisons, price-to-earnings work, and research
        into performance changes over time. EPS is not the same as cash
        received by shareholders.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Earnings per Share?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Earnings per share represents the portion of a company&apos;s earnings
        attributable to each weighted-average common share. It is a widely used
        profitability measure for comparing periods, but EPS alone does not
        determine valuation or investment suitability.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Earnings per Share Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EPS = (Net Income − Preferred Dividends)</p>
        <p>÷ Weighted-Average Common Shares Outstanding</p>
      </div>
      <h3 className="mt-4 text-base font-semibold text-accent">Net income</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Profit after expenses, interest, and taxes for the reporting period.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Preferred dividends
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Amounts attributable to preferred shareholders are deducted so EPS
        reflects earnings available to common shareholders. Common-stock
        dividends are not deducted in the basic EPS formula.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Weighted-average common shares
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the period&apos;s weighted-average common shares outstanding, not
        simply the ending share count. Basic EPS differs from diluted EPS, which
        can include potentially dilutive securities.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Earnings per Share
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Find net income for the reporting period.</li>
        <li>Find preferred dividends for the same period.</li>
        <li>Determine weighted-average common shares outstanding.</li>
        <li>Subtract preferred dividends from net income.</li>
        <li>Divide by weighted-average common shares.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net income $13,120,000,000</p>
        <p>Preferred dividends $200,000,000</p>
        <p>Common shares 333,400,000</p>
        <p>(13,120,000,000 − 200,000,000) ÷ 333,400,000 ≈ $38.75/share</p>
      </div>

      <h2
        id="applications"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Applications of Earnings per Share
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EPS is used in stock valuation discussions, profitability reviews,
        annual and quarterly comparisons, P/E calculations, investment
        research, and earnings-growth analysis. Cross-company comparisons still
        need context for share count and capital structure.
      </p>

      <h2
        id="basic-vs-diluted"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Basic EPS vs Diluted EPS
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Basic EPS uses weighted-average common shares outstanding. Diluted EPS
        accounts for potentially dilutive instruments such as certain options,
        warrants, and convertibles when applicable. This calculator implements
        basic EPS only.
      </p>

      <h2
        id="why-changes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why EPS Changes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Changes in net income or operating performance</li>
        <li>Share issuances or repurchases</li>
        <li>Preferred dividend amounts</li>
        <li>One-time gains or losses</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buybacks can raise EPS by lowering the weighted-average share count even
        when net income is flat.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of EPS
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Depends on accounting earnings, not cash flow alone</li>
        <li>Share buybacks can influence the ratio</li>
        <li>Does not reveal leverage or liquidity by itself</li>
        <li>Does not prove a stock is undervalued or overvalued</li>
        <li>One-time items can temporarily distort results</li>
      </ul>

      <h2
        id="considerations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Four Investment Considerations
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        1. Return on equity
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROE complements EPS by relating earnings to shareholders&apos; equity.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        2. EBITDA and operating performance
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating measures can add context beyond bottom-line EPS.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">3. EPS growth</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trends across periods usually matter more than a single EPS figure.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        4. Valuation ratios
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P/E = Share Price ÷ EPS. A conventional P/E is not meaningful when EPS
        is zero or negative.
      </p>

      <h2
        id="eps-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...EPS_FAQS]} />
      </div>
    </article>
  );
}
