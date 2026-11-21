import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CR_FAQS } from './content';

export function CurrentRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cr"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Current Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The current ratio (also called the working capital ratio) compares
        current assets to current liabilities. Analysts use it as a short-term
        liquidity coverage indicator from the balance sheet — not a complete
        measure of cash generation or solvency.
      </p>

      <h2
        id="cr-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The Current Ratio Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Current Ratio = Current Assets / Current Liabilities
        <br />
        Working Capital = Current Assets − Current Liabilities
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Current Ratio With Our Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Obtain a balance sheet for a single reporting date.</li>
        <li>Identify current assets and current liabilities.</li>
        <li>Enter both amounts in the same currency.</li>
        <li>Review the dimensionless current ratio and working capital.</li>
        <li>Compare with prior periods and relevant industry context.</li>
      </ol>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example of Current Ratio Calculation
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>CA $400,000 · CL $200,000 → CR = 2.00 · WC = $200,000.</li>
        <li>CA $150,000 · CL $200,000 → CR = 0.75 · WC = −$50,000.</li>
      </ul>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Current Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal ideal. Liquidity needs vary by industry, operating
        cycle, inventory and receivable quality, financing access, seasonality,
        and cash-flow stability.
      </p>

      <h2
        id="below-one"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Ratio Below One
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current liabilities exceed current assets on the reported balance sheet.
        Investigate further — do not treat it as automatic failure.
      </p>

      <h2
        id="above-two"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Ratio Above Two
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Coverage looks strong on paper, but a high ratio can also reflect
        slow-moving inventory or excess working capital. Dig into composition and
        cash flow.
      </p>

      <h2
        id="vs-quick"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Ratio vs. Quick Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The current ratio includes all current assets. The quick ratio uses a
        narrower liquid-asset numerator (commonly cash, marketable securities,
        and receivables). They are related but not interchangeable.
      </p>

      <h2
        id="vs-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Ratio vs. Cash Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash ratio typically focuses on cash and cash equivalents (sometimes
        eligible marketable securities) over current liabilities — a stricter
        liquidity lens than the current ratio.
      </p>

      <h2
        id="working-capital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Ratio and Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Working capital is CA − CL in currency units. The current ratio is a
        dimensionless coverage multiple. Negative working capital is
        mathematically valid and must be interpreted in context.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can a Business Improve Its Current Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common levers include faster collections, inventory discipline, stronger
        operating cash flow, and careful short-term debt management. Some
        transactions change the ratio without improving real liquidity.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Mistakes When Calculating Current Ratio
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mixing reporting dates or currencies.</li>
        <li>Misclassifying current vs noncurrent items.</li>
        <li>Ignoring asset liquidity and receivable quality.</li>
        <li>Dividing by zero liabilities.</li>
        <li>Treating the ratio as a complete financial assessment.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the Current Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is a point-in-time balance-sheet snapshot; it does not measure
        operating cash flow; inventory and receivables may not convert as
        assumed; seasonality and accounting policies matter. This tool provides
        educational estimates, not financial advice.
      </p>

      <section id="cr-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CR_FAQS]} />
        </div>
      </section>
    </article>
  );
}
