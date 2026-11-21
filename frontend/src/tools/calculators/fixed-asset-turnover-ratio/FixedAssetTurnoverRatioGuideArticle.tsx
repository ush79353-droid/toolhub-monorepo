import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FIXED_ASSET_TURNOVER_RATIO_FAQS } from './content';

export function FixedAssetTurnoverRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fat"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Fixed Asset Turnover?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed asset turnover (FAT) shows how efficiently a company generates
 revenue from its net fixed asset base; typically net property, plant,
        and equipment. It is an asset-utilization measure, not a profitability
        ratio. Capital-intensive industries often report lower FAT than
        asset-light businesses even when both are healthy.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Asset Turnover Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        FAT = Revenue / Average Fixed Assets
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue (or net sales) is the period’s top-line activity. Average fixed
        assets are the average net carrying amount of qualifying fixed assets
        over the same period.
      </p>

      <h2
        id="average-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Average Fixed Assets
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        Average Fixed Assets = (Starting + Final) / 2
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use beginning and ending net PP&amp;E (or another consistently defined
        net fixed asset base) for the same entity and currency as revenue. When
        large mid-period acquisitions or disposals occur, a time-weighted
 average may be more representative; this calculator uses the standard
        two-point average.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Fixed Asset Turnover
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine starting net fixed assets.</li>
        <li>Determine final net fixed assets.</li>
        <li>Average the two balances.</li>
        <li>Identify net revenue for the same period.</li>
        <li>Divide revenue by average fixed assets.</li>
        <li>Format the result as a multiplier (for example 0.45×).</li>
        <li>Interpret with industry, asset age, and CapEx context.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete Fixed Asset Turnover Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Starting fixed assets 15,000,000 + Final 18,000,000 → Average
        16,500,000. Revenue 7,500,000 → FAT = 7,500,000 / 16,500,000 ≈{' '}
        <strong>0.45×</strong>. About $0.45 of revenue per $1.00 of average net
        fixed assets for the period.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Fixed Asset Turnover
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Higher FAT:</strong> More revenue per dollar of net fixed
 assets; utilization, volume, asset-light models, or depreciated book
          values.
        </li>
        <li>
          <strong>Lower FAT:</strong> Heavy fixed investment, lower utilization,
          recent CapEx, or capital-intensive operations.
        </li>
        <li>
          <strong>Zero FAT:</strong> Zero revenue with a positive average asset
          base.
        </li>
        <li>
 <strong>Undefined:</strong> Zero average fixed assets; do not divide.
        </li>
      </ul>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Fixed Asset Turnover Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal “good” FAT. Compare peers in the same industry,
        consider asset age and depreciation policy, capacity utilization,
        maturity, and investment cycles.
      </p>

      <h2
        id="vs-profitability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does High Fixed Asset Turnover Mean Higher Profitability?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No. A company can have high FAT with thin margins or losses, or low FAT
        with strong margins. FAT measures revenue efficiency relative to fixed
 assets; pair it with margin and return metrics.
      </p>

      <h2
        id="vs-tat"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Asset Turnover vs. Total Asset Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total asset turnover divides revenue by average total assets. FAT
        focuses on the net fixed asset base only. Do not use the ratios
        interchangeably.
      </p>

      <h2
        id="vs-inventory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Asset Turnover vs. Inventory Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory turnover typically uses cost of goods sold over average
        inventory. FAT uses revenue over average fixed assets. They measure
        different parts of operations.
      </p>

      <h2
        id="depreciation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Depreciation Affects FAT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depreciation reduces net book value and can raise FAT without any
        improvement in physical productivity. Older, fully depreciated fleets
        can look highly efficient on paper.
      </p>

      <h2
        id="capex"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Capital Expenditures Affect FAT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        New facilities and equipment raise average fixed assets before the
 related revenue fully appears, which can temporarily lower FAT; often
        a timing effect rather than permanent inefficiency.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Fixed Asset Turnover
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve capacity utilization and production processes.</li>
        <li>Grow revenue from existing assets.</li>
        <li>Maintain equipment and reduce idle assets.</li>
        <li>Sell unnecessary equipment when it truly frees capital.</li>
        <li>Time CapEx so assets become productive promptly.</li>
      </ul>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common FAT Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Using net income instead of revenue.</li>
        <li>Mixing gross and net fixed asset values.</li>
        <li>Skipping the average and using only ending assets.</li>
        <li>Mixing reporting periods or currencies.</li>
        <li>Dividing by zero average assets.</li>
        <li>Treating high FAT as guaranteed profitability.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Fixed Asset Turnover
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Book values depend on accounting policies; asset age and revaluations
        affect the denominator; outsourcing can raise FAT without improving all
        operating outcomes; FAT does not measure profitability, cash flow, or
        debt service. Use it with other financial and operational indicators.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
 Educational illustration only; not accounting, investment, or
        professional advice. Confirm figures against audited statements and
        applicable frameworks.
      </p>

      <h2
        id="fat-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...FIXED_ASSET_TURNOVER_RATIO_FAQS]} />
      </div>
    </article>
  );
}
