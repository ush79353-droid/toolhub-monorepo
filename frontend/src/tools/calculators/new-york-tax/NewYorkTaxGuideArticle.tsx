import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NEW_YORK_TAX_FAQS } from './content';

export function NewYorkTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-new-york-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates federal ordinary income tax, New York State personal
        income tax, and New York City resident income tax from adjusted gross income
        (AGI). It is an educational estimate—not a substitute for Form 1040, Form
        IT-201, or NYC Form IT-360.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter AGI and choose how that amount is stated (year, month, week, etc.).</li>
        <li>
          Select pay frequency, tax year (2025), filing status, NYC residency,
          dependents, and deductions.
        </li>
        <li>
          Review federal tax, NY State tax, NYC tax (if resident), totals, effective
          rate, and per-pay-period estimates.
        </li>
      </ol>

      <h2
        id="new-york-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual AGI = entered AGI × periods-per-year for the income period</p>
        <p>Federal taxable = max(0, AGI − max(federal standard, itemized))</p>
        <p>
          NY taxable = max(0, AGI − max(NY standard, itemized) − $1,000 × dependents)
        </p>
        <p>NYC taxable = NY taxable (simplified resident model)</p>
        <p>Federal tax = progressive ordinary brackets (no dependent credits)</p>
        <p>NY State tax = NYS rate schedule on NY taxable</p>
        <p>NYC tax = NYC rate schedule on NYC taxable (if resident)</p>
        <p>Effective rate = total income tax ÷ AGI</p>
        <p>Take-home / period = (AGI − income taxes − post-tax) ÷ pay periods</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sources: Rev. Proc. 2024-40; NYS IT-201 (2025); N.Y. Tax Law §601; NYC
        IT-201 / IT-360.1 resident rate schedules.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · NYC resident · TY2025 · AGI $80,000/year · 0 dependents · itemized $0</p>
        <p>Federal std. $15,750 → taxable $64,250 · NY std. $8,000 → taxable $72,000</p>
        <p>≈ $9,049 federal · ≈ $3,795 NY State · ≈ $2,666 NYC · ≈ 19.39% effective</p>
      </div>

      <h2
        id="new-york-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NEW_YORK_TAX_FAQS]} />
      </div>
    </article>
  );
}