import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NET_OPERATING_ASSETS_FAQS } from './content';

export function NetOperatingAssetsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-noa"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Does NOA Stand For?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOA means Net Operating Assets — the net capital invested in a company’s
        operating activities after subtracting operating liabilities from
        operating assets.
      </p>

      <h2
        id="noa-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Net Operating Assets Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        NOA = Operating Assets − Operating Liabilities
      </div>

      <h2
        id="operating-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Operating Assets?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In this simplified calculator: operating cash, accounts receivable,
        inventory, prepaid expenses, and fixed assets. Strict analysis may
        exclude excess cash and non-operating financial assets.
      </p>

      <h2
        id="operating-liabilities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Operating Liabilities?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here: accounts payable and accrued operating expenses. Do not treat bank
        loans or bonds as operating liabilities.
      </p>

      <h2
        id="calc-oa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Operating Assets
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        OA = C + AR + I + PE + FA
      </div>

      <h2
        id="calc-ol"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Operating Liabilities
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        OL = AP + AOE
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Net Operating Assets
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter operating cash, receivables, inventory, prepaid expenses, and fixed assets.</li>
        <li>Sum them to get operating assets.</li>
        <li>Enter accounts payable and accrued operating expenses.</li>
        <li>Sum them to get operating liabilities.</li>
        <li>Subtract: NOA = OA − OL.</li>
      </ol>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Complete NOA Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash 250k + AR 300k + Inventory 400k + Prepaid 100k + Fixed 500k → OA{' '}
        <strong>$1,550,000</strong>. Payables 400k + Accruals 200k → OL{' '}
        <strong>$600,000</strong>. NOA = <strong>$950,000</strong>.
      </p>

      <h2
        id="why-useful"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Are Net Operating Assets Useful?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOA supports operating capital analysis, efficiency review, capital
        allocation, and ratios such as RNOA.
      </p>

      <h2
        id="pos-neg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Positive vs. Negative NOA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive NOA means OA &gt; OL. Zero means equality. Negative means OL &gt;
        OA — not automatically bankruptcy.
      </p>

      <h2
        id="vs-total-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA vs. Total Assets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total assets include non-operating items. NOA uses operating
        classifications only. Do not equate NOA with total assets − total
        liabilities (that is equity).
      </p>

      <h2
        id="vs-working-capital"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA vs. Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Working capital = current assets − current liabilities. NOA can include
        long-term operating assets such as PPE.
      </p>

      <h2
        id="vs-nowc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA vs. Net Operating Working Capital
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOWC focuses on operating current items. NOA is broader when fixed and
        other long-term operating assets are included.
      </p>

      <h2
        id="vs-noi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA vs. Net Operating Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOA is a balance-sheet stock. NOI is an income measure. They are not
        interchangeable.
      </p>

      <h2
        id="rnoa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA and Return on Net Operating Assets
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        RNOA = (NOPAT / Average NOA) × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: beginning NOA 800k, ending 1,000k → average 900k; NOPAT 180k →
        RNOA 20%. This primary tool does not compute RNOA.
      </p>

      <h2
        id="valuation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA and Business Valuation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating reformulations link enterprise value to operating earnings and
        the NOA capital base, separate from net financial obligations.
      </p>

      <h2
        id="performance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA and Financial Performance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pair NOA with operating income, NOPAT, revenue, and asset turnover to
        judge how efficiently capital earns returns.
      </p>

      <h2
        id="balance-sheet"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOA and Balance Sheet Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Analysts reclassify balance-sheet lines into operating vs financing
        buckets. Lease, pension, and mixed items need framework-specific care.
      </p>

      <h2
        id="cash-effects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Cash Affects NOA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating cash raises NOA. Excess cash parked as a financial asset is
        often excluded so NOA reflects operating capital only.
      </p>

      <h2
        id="inventory-effects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Inventory Affects NOA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Inventory builds raise operating assets and NOA — more capital tied in
        stock until sold.
      </p>

      <h2
        id="ar-effects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Accounts Receivable Affects NOA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Uncollected credit sales increase receivables and NOA until cash is
        collected.
      </p>

      <h2
        id="ap-effects"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Accounts Payable Affects NOA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Supplier credit raises operating liabilities and reduces NOA — operations
        are partly vendor-financed.
      </p>

      <h2
        id="efficiency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Operating Asset Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Faster collections, leaner inventory, better asset utilization, and
        thoughtful payables — without starving growth or supplier relationships.
        Raising or cutting NOA is not universally good.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common NOA Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Treating total assets as operating assets</li>
        <li>Including excess cash without adjustment</li>
        <li>Treating bank loans as operating liabilities</li>
        <li>Confusing NOA with equity, working capital, or NOI</li>
        <li>Mixing currencies or reporting dates</li>
        <li>Treating missing inputs as zero</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the NOA Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simplified five-asset / two-liability model; cash classification requires
        judgment; not a profitability measure; industry structures differ.
        Educational illustration only — not accounting advice.
      </p>

      <h2
        id="noa-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...NET_OPERATING_ASSETS_FAQS]} />
      </div>
    </article>
  );
}
