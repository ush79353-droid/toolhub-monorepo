import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARKUP_FAQS } from './content';

export function MarkupGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Markup Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Markup Calculator helps retailers, wholesalers, entrepreneurs, and
        product managers turn unit cost into a selling price — or reverse the
        math when they already know revenue, profit, or a target markup rate.
        Enter any two compatible values among cost, markup percentage, revenue
        (selling price), and profit; the other two update in real time. Currency
        labels are denomination only and do not convert exchange rates.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use it to check list prices, compare markup with margin, and walk through
        step-by-step pricing arithmetic before you commit inventory or publish a
        catalog. The tool performs pricing math; it does not choose the
        commercially optimal price for your market.
      </p>

      <h2
        id="what-is-markup"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Markup?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markup is the amount added to product cost to determine selling price.
        When expressed as a percentage, markup uses <em>cost</em> as the
        denominator — not revenue. Example: a product costs $50 and sells for
        $70. Profit is $20, so markup is 20 ÷ 50 × 100 = 40%.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Markup Definition?
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Cost</strong> — purchase or production cost per unit.
        </li>
        <li>
          <strong>Revenue / selling price</strong> — what the buyer pays per
          unit.
        </li>
        <li>
          <strong>Profit</strong> — revenue minus cost for that unit (gross unit
          contribution before overhead, fees, or taxes not in cost).
        </li>
        <li>
          <strong>Markup percentage</strong> — profit ÷ cost × 100.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unit profit here is not automatically company net profit. Operating
        expenses, returns, payment fees, and taxes can change the bottom line
        even when unit markup looks healthy.
      </p>

      <h2
        id="margin-vs-markup"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Difference Between Margin and Markup?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both describe profit, but they use different bases:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Markup% = Profit ÷ Cost × 100</p>
        <p>Margin% = Profit ÷ Revenue × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: cost $60, revenue $100, profit $40 → markup ≈ 66.67%, margin =
        40%. A 40% markup is not the same as a 40% margin. Confusing the two is
        a common way to underprice products.
      </p>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-accent">
              <th className="py-2 pr-3 font-semibold">Metric</th>
              <th className="py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border/60">
              <td className="py-2 pr-3">Cost</td>
              <td className="py-2">$60</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-3">Revenue</td>
              <td className="py-2">$100</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-3">Profit</td>
              <td className="py-2">$40</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-3">Markup</td>
              <td className="py-2">66.67%</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Margin</td>
              <td className="py-2">40%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Conversions (when defined): Margin% = Markup% ÷ (100 + Markup%) × 100;
        Markup% = Margin% ÷ (100 − Margin%) × 100. Do not convert when the
        denominator is zero (markup −100% or margin 100%).
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Markup?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine unit cost.</li>
        <li>Determine selling price (revenue).</li>
        <li>Subtract cost from selling price to get profit.</li>
        <li>Divide profit by cost.</li>
        <li>Multiply by 100 for the markup percentage.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: cost $50, selling price $70 → profit $20 → markup 40%.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Markup Formula?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Markup% = (Revenue − Cost) ÷ Cost × 100</p>
        <p>Markup% = Profit ÷ Cost × 100</p>
        <p>Revenue = Cost × (1 + Markup%/100)</p>
        <p>Profit = Revenue − Cost = Cost × (Markup%/100)</p>
      </div>

      <h2
        id="selling-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Selling Price from Markup
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If cost is $80 and you want a 25% markup: revenue = 80 × 1.25 = $100;
        profit = $20. Negative markup rates (above −100%) produce selling prices
        below cost — useful for clearance or loss-leader analysis, but not a
        sustainable default strategy.
      </p>

      <h2
        id="cost-from-price"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cost from Selling Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reverse paths this calculator supports include:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Cost = Revenue ÷ (1 + Markup%/100) — e.g. $150 revenue at 50% markup →
          $100 cost.
        </li>
        <li>Cost = Revenue − Profit — e.g. $120 − $30 = $90.</li>
        <li>
          Cost = Profit ÷ (Markup%/100) when markup ≠ 0 — e.g. $40 profit at 20%
          markup → $200 cost and $240 revenue.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some pairs (such as profit with 0% markup and nonzero profit) do not
        uniquely determine cost; the calculator reports that clearly instead of
        inventing a number.
      </p>

      <h2
        id="price-management"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markup in Price Management
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markup supports pricing strategy, cost recovery, and gross-profit
        planning. Competitive position, demand elasticity, inventory turnover,
        and brand positioning also matter. A mathematically valid markup can
        still be commercially unsuitable if customers will not buy at that price
        or if hidden costs were left out of unit cost.
      </p>

      <h2
        id="industries"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markup by Specific Industries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Retail stores, grocery, apparel, restaurants, manufacturing, wholesale
        distribution, electronics, and professional services all use markup
        language — but typical rates vary by channel, perishability, brand, and
        competition. This guide does not invent universal industry benchmarks;
        treat published “average markup” figures as starting points for research,
        not guarantees.
      </p>

      <h2
        id="vs-markdown"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markup vs. Markdown
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Markup increases selling price relative to cost. Markdown reduces an
        established list selling price. Example: cost $60 with 50% markup → list
        $90. A later 20% markdown from $90 → actual $72. Different denominators,
        different decisions — see also the{' '}
        <Link
          href="/tools/markdown-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markdown Calculator
        </Link>
        .
      </p>

      <h2
        id="vs-profit-margin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Markup vs. Profit Margin
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Finance teams often speak in margins; merchandising teams often speak in
        markups. Translate carefully: a target 20% margin needs a 25% markup on
        cost for a positive-cost product. This calculator shows both when a
        complete cost/revenue pair is available.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Pricing Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confusing markup with margin.</li>
        <li>Ignoring operating expenses and payment fees.</li>
        <li>Underestimating true product cost (freight, waste, returns).</li>
        <li>Rounding too early in multi-step pricing.</li>
        <li>Applying “markup” to selling price instead of cost.</li>
        <li>Using one markup percentage for every SKU.</li>
        <li>Ignoring competitor pricing and willingness to pay.</li>
      </ul>

      <h2
        id="choose"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Choose a Markup Percentage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Factors include cost structure, contribution targets, competitive set,
        perceived value, channel fees, and inventory risk. The calculator tells
        you what selling price a markup implies — not whether that price will win
        sales or cover the full business. Combine arithmetic with market research
        and a full cost view.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <Link
          href="/tools/margin-and-markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Margin &amp; Markup
        </Link>
        {' · '}
        <Link
          href="/tools/markdown-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markdown
        </Link>
        {' · '}
        <Link
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
        </Link>
        {' · '}
        <Link
          href="/tools/sales-tax-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sales Tax
        </Link>
        {' · '}
        <Link
          href="/tools/vat-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          VAT
        </Link>
        {' · '}
        <Link
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
        </Link>
        {' · '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        {' · '}
        <Link
          href="/tools/cyber-monday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cyber Monday
        </Link>
      </p>

      <h2
        id="mu-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MARKUP_FAQS]} />
      </div>
    </article>
  );
}
