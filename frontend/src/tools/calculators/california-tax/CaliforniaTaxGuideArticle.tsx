import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CALIFORNIA_TAX_FAQS } from './content';

export function CaliforniaTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-california-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates California personal income tax, federal ordinary income
        tax, employee payroll taxes (Social Security, Medicare, Additional Medicare,
        and California SDI), and an assessed-value property tax projection for
 selected counties. It is an educational estimate, not a substitute for Form
        1040, Form 540, EDD withholding, or a county tax bill.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter AGI and choose how that amount is stated (year, month, week, etc.).</li>
        <li>Select pay frequency, tax year, filing status, dependents, and deductions.</li>
        <li>
          Optionally enter assessed home value, county, and applied property tax rate
          (county average pre-filled; edit for your tax-rate area).
        </li>
        <li>
          Review federal tax, California tax, payroll taxes, take-home per period, and
          estimated annual property tax (kept separate from payroll).
        </li>
      </ol>

      <h2
        id="california-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual AGI = entered AGI × periods-per-year for the income period</p>
        <p>Federal taxable = max(0, AGI − max(federal standard, itemized))</p>
        <p>CA taxable = max(0, AGI − max(CA standard, itemized))</p>
        <p>Federal tax = progressive ordinary brackets − other dependent credits</p>
        <p>CA tax = Form 540 rate schedule − exemption credits (+ MHST over $1M)</p>
        <p>Payroll = OASDI + Medicare + Additional Medicare + SDI (AGI as wages)</p>
        <p>Property tax = assessed home value × applied rate%</p>
        <p>Take-home / period = (AGI − income/payroll taxes − post-tax) ÷ periods</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sources: FTB 2025 Form 540 / tax rate schedules / Tax News indexing; Rev.
        Proc. 2024-40 &amp; 2025-32; IRS Pub. 15; SSA wage bases; EDD DE 44 / DE 3395
        SDI rates; BOE 2024–25 county-average statutory property-tax rates.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · TY2025 · AGI $80,000/year · 0 dependents · itemized $0</p>
        <p>Federal std. $15,750 → taxable $64,250 · CA std. $5,706 → taxable $74,294</p>
        <p>Assessed $500,000 · Alameda 1.22% → property tax $6,100</p>
        <p>Review federal + CA + payroll totals and weekly take-home in the results table</p>
      </div>

      <h2
        id="california-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CALIFORNIA_TAX_FAQS]} />
      </div>
    </article>
  );
}
