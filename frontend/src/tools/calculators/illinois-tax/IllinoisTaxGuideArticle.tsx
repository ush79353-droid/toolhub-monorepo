import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ILLINOIS_TAX_FAQS } from './content';

export function IllinoisTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-illinois-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate federal ordinary income tax, Illinois flat individual income tax
        (4.95%), and a county-level property tax projection for all 102 Illinois
        counties. FICA is omitted because AGI is not assumed to be FICA wages.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter AGI, pay frequency, tax year, filing status, dependents, and deductions.</li>
        <li>Optionally enter home value and Illinois county (ACS rate pre-filled).</li>
        <li>Review federal tax, Illinois tax, combined/period amounts, and property tax.</li>
      </ol>

      <h2
        id="illinois-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Federal taxable = max(0, AGI − max(std, itemized))</p>
        <p>IL taxable = max(0, AGI − exemption allowance)</p>
        <p>IL tax = IL taxable × 4.95%</p>
        <p>Property ≈ home value × ACS effective rate%</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sources: IDOR IL-1040 / income tax rates; Rev. Proc. 2024-40 &amp; 2025-32;
        U.S. Census ACS 2024 county effective property tax rates.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · TY2026 · AGI $80,000 · Adams County · home $200,000</p>
        <p>IL exemption $2,925 → IL taxable $77,075 → IL tax ≈ $3,815.21</p>
        <p>Property ≈ $200,000 × 1.582% ≈ $3,164</p>
      </div>

      <h2
        id="illinois-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ILLINOIS_TAX_FAQS]} />
      </div>
    </article>
  );
}
