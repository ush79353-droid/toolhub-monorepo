import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALABAMA_TAX_FAQS } from './content';

export function AlabamaTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-alabama-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates Alabama individual income tax and the four local
        occupational taxes shown in the form (Bessemer, Birmingham, Gadsden, Macon
        County). It is an educational estimate—not a filing substitute—and does not
        model FICA, federal tax, or Alabama credits.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter AGI and choose how that amount is stated (year, month, week, etc.).</li>
        <li>Select pay frequency for the take-home estimate and the tax year.</li>
        <li>Choose filing status, jurisdiction, additional dependents, and deductions.</li>
        <li>
          Review annualized AGI, Alabama taxable income, state tax, local occupational
          tax, and take-home per pay period.
        </li>
      </ol>

      <h2
        id="alabama-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual AGI = entered AGI × periods-per-year for the income period</p>
        <p>Deduction = max(Form 40 standard deduction chart, itemized)</p>
        <p>Taxable income = max(0, AGI − deduction − personal exemption − dependent exemptions)</p>
        <p>State tax = progressive 2% / 4% / 5% brackets by filing status (ADOR)</p>
        <p>Local tax = Annual AGI × jurisdiction rate (earned-income proxy)</p>
        <p>Take-home / period = (AGI − total tax − post-tax deductions) ÷ pay periods</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sources: Alabama Department of Revenue individual income tax rate FAQ; 2025 Form
        40 instructions (standard deduction chart, exemptions); local occupational rates
        for Bessemer/Birmingham 1%, Gadsden 2%, Macon County 1% (city/county employer
        withholding materials and Alabama League of Municipalities occupational tax list).
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · TY2026 · Bessemer · AGI $50,000/year · 0 dependents · itemized $0</p>
        <p>Standard deduction (chart) $2,500 · personal exemption $1,500 → taxable $46,000</p>
        <p>State tax ≈ $2,265 · local 1% ≈ $500 · total tax ≈ $2,765</p>
        <p>After-tax ≈ $47,235 · weekly take-home ≈ $47,235 / 52</p>
      </div>

      <h2
        id="alabama-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ALABAMA_TAX_FAQS]} />
      </div>
    </article>
  );
}
