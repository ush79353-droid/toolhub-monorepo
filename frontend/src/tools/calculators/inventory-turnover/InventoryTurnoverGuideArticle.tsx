import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INVENTORY_TURNOVER_FAQS } from './content';

export function InventoryTurnoverGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-inventory"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Inventory?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Inventory includes goods held for sale or production; raw materials,
 work-in-progress, finished goods, or merchandise; measured under the
        applicable cost basis (for example FIFO or weighted average).
      </p>

      <h2
        id="current-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inventory as a Part of Current Assets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory is typically a current asset and a major working-capital
        component. How quickly it converts into COGS (and ultimately cash)
        affects liquidity and the cash conversion cycle.
      </p>

      <h2
        id="efficiency-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inventory Turnover as a Financial Efficiency Ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory turnover links period COGS to average inventory investment. It
        helps assess stock management, demand conditions, and operational
 efficiency; always with industry and seasonality context.
      </p>

      <h2
        id="turnover-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inventory Turnover Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Inventory Turnover = COGS / Average Inventory
      </div>

      <h2
        id="average-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Average Inventory Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average Inventory = (Beginning + Ending) / 2
      </div>

      <h2
        id="days-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inventory Days Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Inventory Days = (Average Inventory / COGS) × Days
        <br />
        Inventory Days = Days / Inventory Turnover
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Inventory Turnover
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine COGS for the period.</li>
        <li>Identify beginning and ending inventory.</li>
        <li>Average the inventory balances.</li>
        <li>Divide COGS by average inventory.</li>
        <li>Enter days in the accounting period.</li>
        <li>Compute inventory days and interpret with industry context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Inventory Turnover Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        COGS 600,000; beginning 100,000; ending 140,000; days 365. Average =
        120,000. Turnover = 600,000 / 120,000 = <strong>5.00×</strong>. Inventory
        days = 365 / 5 = <strong>73 days</strong>.
      </p>

      <h2
        id="investors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does Inventory Turnover Tell Investors?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It can signal working-capital efficiency, demand strength, and inventory
 investment intensity, but not profitability, stockout risk, or product
        mix quality on its own.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret High and Low Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher turnover often means faster movement and shorter holding periods;
        lower turnover may reflect excess stock, weak demand, or intentional
        seasonal builds. Neither is automatically good or bad.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Inventory Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Benchmarks vary widely; groceries turn faster than furniture or luxury
        goods. Compare peers, history, shelf life, margins, stockouts, and the
        cash conversion cycle.
      </p>

      <h2
        id="cash-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Inventory Turnover Affects Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Faster inventory conversion can free cash tied in stock. CCC = DIO + DSO
        − DPO; inventory days from this tool can serve as DIO under a consistent
        definition.
      </p>

      <h2
        id="vs-dio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inventory Turnover and Days Inventory Outstanding
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DIO (inventory days) is the holding-period counterpart of turnover. When
        both are defined, Days ≈ Period ÷ Turnover.
      </p>

      <h2
        id="vs-asset"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inventory Turnover vs. Asset Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Asset turnover typically uses revenue over average total assets.
 Inventory turnover uses COGS over average inventory; different
        numerator and denominator.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Inventory Turnover
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve demand forecasting and replenishment</li>
        <li>Reduce obsolete and slow-moving stock</li>
        <li>Coordinate with suppliers and assortment planning</li>
        <li>Monitor stock levels without starving sales</li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Inventory Turnover Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using revenue or purchases instead of COGS</li>
        <li>Skipping the average and using only ending inventory</li>
        <li>Mixing periods, currencies, or valuation methods</li>
        <li>Dividing by zero inventory or assuming higher is always better</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Inventory Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Industry and seasonality dominate comparisons; valuation methods and
        write-downs affect balances; a two-point average can miss mid-period
        swings; and the ratio does not measure profitability or stockout cost
        directly.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
 Educational illustration only; not accounting, audit, or investment
        advice.
      </p>

      <h2
        id="inv-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...INVENTORY_TURNOVER_FAQS]} />
      </div>
    </article>
  );
}
