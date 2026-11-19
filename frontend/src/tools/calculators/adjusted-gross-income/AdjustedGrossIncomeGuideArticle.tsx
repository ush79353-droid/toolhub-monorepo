import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AGI_FAQS } from './content';

export function AdjustedGrossIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-agi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Adjusted Gross Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjusted Gross Income (AGI) is your total income for the year minus certain
        adjustments listed on Schedule 1 (Form 1040). AGI is figured before the
        standard or itemized deduction. Many credits and phaseouts use AGI (or a
        modified AGI). This tool estimates Schedule 1-style AGI for Tax Year 2025; it
        is not a complete Form 1040.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Open Filing details to set filing status, workplace plan coverage, HSA
          coverage, and eligibility flags used for deduction limits.
        </li>
        <li>Enter gross income sources (and optional “show more” fields).</li>
        <li>
          Enter above-the-line adjustments. Positive deduction amounts are subtracted
          from income; eligibility and IRS caps apply.
        </li>
        <li>Read Gross income, Total adjustments, and Adjusted gross income.</li>
      </ol>

      <h2
        id="agi-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        AGI Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross Income = Sum of included taxable income sources*</p>
        <p>Total Adjustments = Sum of eligible Schedule 1 adjustments</p>
        <p>AGI = Gross Income − Total Adjustments</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        *Net capital losses included in income are limited to $3,000 ($1,500 if married
        filing separately). Amounts keep full precision and round only for display.
        IRS dollar limits are tested in USD after FX conversion.
      </p>

      <h2
        id="irs-adjustments-2025"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IRS Adjustments (Tax Year 2025)
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Educator expenses — up to $300 (IRS Schedule 1 / educator expense rules).
        </li>
        <li>
          HSA deduction — up to $4,300 self-only or $8,550 family, plus $1,000 if age
          55+ (Pub. 969 / Form 8889).
        </li>
        <li>
          Traditional IRA — up to $7,000 ($8,000 if age 50+), with workplace-plan MAGI
          phaseouts (Pub. 590-A).
        </li>
        <li>
          Student loan interest — up to $2,500; MAGI phaseout $85,000–$100,000 (single /
          HoH / QSS) or $170,000–$200,000 (joint); not allowed if married filing
          separately (Pub. 970).
        </li>
        <li>
          Self-employed health insurance — only when marked eligible; capped by net
          business profit (Schedule 1). Ordinary employee premiums are not deducted
          here.
        </li>
        <li>
          Deductible half of self-employment tax — estimated from business income when
          “show more deductions” is used (Schedule SE simplified).
        </li>
      </ul>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · not covered by a workplace plan · wages $80,000 · IRA $7,000</p>
        <p>Gross income = 80,000</p>
        <p>IRA adjustment = 7,000 (under the annual limit; no phaseout)</p>
        <p>AGI = 80,000 − 7,000 = 73,000</p>
      </div>

      <h2
        id="agi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...AGI_FAQS]} />
      </div>
    </article>
  );
}
