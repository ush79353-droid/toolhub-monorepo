import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARKDOWN_FAQS } from './content';

export function MarkdownGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Markdown Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Markdown Calculator finds how much a product’s selling price has
        been reduced from its original ticket price. Enter any two compatible
        values among original price, actual price, markdown amount, and markdown
 percentage: the other two are derived. It supports retail pricing,
        clearance analysis, and promotional planning. It is not a Markdown text
        formatting tool. Currency labels are denomination only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Markdown?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In retail, a markdown is a reduction from an original selling price to a
        lower actual selling price. Example: original $100, reduced to $80 →
        markdown $20 (20%). “Discount” often describes similar reductions in
        everyday language; markdown emphasizes the cut from a previously
        established list price.
      </p>

      <h2
        id="process"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markdown Calculation Process
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Four linked variables: original selling price, actual selling price,
        markdown amount, and markdown percentage. Any valid independent pair
        determines the rest. This calculator tracks the last two fields you edit
        and prefers keeping the original price as an anchor when you change the
        markdown amount or percentage.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 How to Use This Markdown Calculator; An Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A shoe retailer lists shoes at $50 and applies a 25% markdown. Markdown
        amount = 50 × 0.25 = $12.50. Actual price = 50 − 12.50 = $37.50. The
        lower price may increase demand and turnover, but unit contribution still
        depends on cost.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Markdown Price Formula?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Markdown = OriginalPrice − ActualPrice</p>
        <p>ActualPrice = OriginalPrice − Markdown</p>
      </div>

      <h2
        id="percentage"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Calculate the Markdown Percentage?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Markdown% = Markdown ÷ OriginalPrice × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: original $200, actual $160 → markdown $40 → 20%. Do not use the
        actual price as the percentage denominator for retail markdown %.
      </p>

      <h2
        id="original"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Original Price Before Markdown
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Original = Actual + Markdown. Or Original = Actual ÷ (1 − Markdown%/100)
        when percentage is below 100%. A 100% markdown with a zero actual price
        does not uniquely recover a prior list price.
      </p>

      <h2
        id="profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Markdown Affects Retail Profit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markdown reduces revenue per unit. It does not by itself prove a loss.
        Example: original $100, cost $60, 20% markdown → sell at $80 → gross
        profit $20 before other expenses. Volume changes may help or hurt overall
        profit.
      </p>

      <h2
        id="vs-markup"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markdown vs. Markup
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markdown cuts an existing selling price. Markup builds selling price from
        cost (or analyzes profit relative to cost). See the{' '}
        <Link
          href="/tools/margin-and-markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Margin &amp; Markup Calculator
        </Link>{' '}
        for cost-based pricing math.
      </p>

      <h2
        id="vs-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markdown vs. Profit Margin
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross margin % = (Selling price − Cost) ÷ Selling price × 100. Markdown %
        = (Original − Actual) ÷ Original × 100. Same numbers can produce very
        different percentages because the denominators differ.
      </p>

      <h2
        id="reasons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Reasons Retailers Use Markdowns
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Seasonal and end-of-season clearance.</li>
        <li>Competitive pricing pressure.</li>
        <li>Overstock and slow-moving inventory.</li>
        <li>Product lifecycle transitions.</li>
        <li>Promotional traffic and customer acquisition.</li>
      </ul>

      <h2
        id="choose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Choose an Appropriate Markdown
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weigh product cost, target margin, inventory age, demand, competitor
        prices, and storage costs. No single markdown % is universally optimal.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Markdown Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using actual price as the % denominator.</li>
        <li>Confusing markdown with markup.</li>
        <li>Ignoring cost when judging “profitability.”</li>
        <li>Adding stacked percentages incorrectly.</li>
        <li>Assuming every markdown means a loss.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link href="/tools/margin-and-markup-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Margin &amp; Markup
        </Link>
        ,{' '}
        <Link href="/tools/discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Discount
        </Link>
        ,{' '}
        <Link href="/tools/percentage-discount-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Percentage Discount
        </Link>
        ,{' '}
        <Link href="/tools/black-friday-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Black Friday
        </Link>
        ,{' '}
        <Link href="/tools/cyber-monday-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Cyber Monday
        </Link>
        ,{' '}
        <Link href="/tools/cash-back-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          Cash Back
        </Link>
        , and{' '}
        <Link href="/tools/vat-calculator" className="font-medium text-primary underline-offset-2 hover:underline">
          VAT
        </Link>
        .
      </p>

      <h2
        id="md-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MARKDOWN_FAQS]} />
      </div>
    </article>
  );
}
