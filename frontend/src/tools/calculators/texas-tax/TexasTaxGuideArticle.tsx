import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TEXAS_TAX_FAQS } from './content';

export function TexasTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-texas-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate federal ordinary income tax, Texas state individual income tax
 ($0, Texas has no personal income tax), and a county-level property tax
        projection for Texas counties. FICA is omitted because AGI is not assumed
        to be FICA wages.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter AGI, pay frequency, tax year, filing status, dependents, and deductions.</li>
        <li>Optionally enter home value and Texas county (ACS rate pre-filled).</li>
        <li>Review federal tax, Texas state tax ($0), combined/period amounts, and property tax.</li>
      </ol>

      <h2
        id="texas-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Federal taxable = max(0, AGI − max(std, itemized))</p>
        <p>Texas state income tax = $0</p>
        <p>Combined income tax = federal + $0 Texas</p>
        <p>Property ≈ home value × ACS effective rate%</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sources: IRS Rev. Proc. 2024-40 &amp; 2025-32; Texas Comptroller property
        tax overview; U.S. Census ACS 2020–2024 county effective property tax rates.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · TY2026 · AGI $80,000 · Anderson County · home $200,000</p>
        <p>Federal tax from TY2026 brackets after standard deduction</p>
        <p>Texas state income tax = $0</p>
        <p>Property ≈ $200,000 × 0.919% (Anderson ACS) ≈ $1,838</p>
      </div>

      <h2
        id="texas-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TEXAS_TAX_FAQS]} />
      </div>
    </article>
  );
}