import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DUPONT_FAQS } from './content';

export function DupontAnalysisGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="intro"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Introduction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The DuPont Analysis Calculator evaluates return on equity by separating
        it into profitability, asset efficiency, and financial leverage. Investors,
        analysts, and managers use it to see which drivers produce ROE rather
        than reading a single headline percentage.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is DuPont Analysis? – The DuPont Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The classic three-factor model multiplies net profit margin, total asset
        turnover, and the equity multiplier (financial leverage). Together they
        decompose book ROE into margin, efficiency, and capital-structure
        effects.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does DuPont Analysis Work?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ROE = NPM × TAT × FL</p>
        <p>NPM = Net Income / Sales</p>
        <p>TAT = Sales / Total Assets</p>
        <p>FL = Total Assets / Total Equity</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate ROE Using DuPont Analysis
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Obtain sales (revenue).</li>
        <li>Obtain net income.</li>
        <li>Obtain total assets.</li>
        <li>Obtain total equity.</li>
        <li>Compute NPM = NI ÷ Sales.</li>
        <li>Compute TAT = Sales ÷ Assets.</li>
        <li>Compute FL = Assets ÷ Equity.</li>
        <li>Multiply NPM × TAT × FL.</li>
        <li>Interpret each driver, not only the product.</li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>$1,000,000 sales · $120,000 NI · $800,000 assets · $400,000 equity</p>
        <p>12% × 1.25 × 2.00 = 30% ROE</p>
      </div>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DuPont Formula – How to Interpret the Calculation
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Profit margin</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A higher margin means more profit retained per dollar of sales.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Asset turnover</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher turnover means more sales generated per dollar of assets (for
        example, 1.25× implies $1.25 of sales per $1 of assets).
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Financial leverage
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A higher equity multiplier usually means more assets relative to equity,
        often financed with liabilities — which can raise ROE and risk.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Return on equity
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ROE measures earnings relative to book equity. High ROE alone does not
        prove a company is financially healthy.
      </p>

      <h2
        id="three-vs-five"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Three-Step vs Five-Step DuPont Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses the traditional three-factor model. Extended
        five-factor versions further split tax burden, interest burden, and
        operating margin. Those inputs are not required here.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is DuPont Analysis Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It supports performance review across periods, profitability and
        efficiency analysis, capital-structure insight, and investment research
        when paired with industry context.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of DuPont Analysis
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Uses historical accounting values.</li>
        <li>Accounting methods differ across firms.</li>
        <li>Industry norms vary widely.</li>
        <li>One-time gains or losses can distort margins.</li>
        <li>Negative equity complicates interpretation.</li>
        <li>Book equity is not market value.</li>
      </ul>

      <h2
        id="improve-roe"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can Companies Improve ROE?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Improve profitability, use assets more efficiently, or manage capital
        structure carefully. Raising debt only to inflate ROE can increase
        financial risk.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        DuPont Analysis Example
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sales $500,000 · NI $40,000 · Assets $250,000 · Equity $125,000</p>
        <p>NPM 8% · TAT 2.00× · FL 2.00× · ROE 32%</p>
      </div>

      <h2
        id="compare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Compare Two Companies Using DuPont Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Firms with similar ROE can get there via different mixes of margin,
        turnover, and leverage. Comparing the three components often reveals more
        than comparing ROE alone.
      </p>

      <h2
        id="da-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...DUPONT_FAQS]} />
      </div>
    </article>
  );
}
