import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INCOME_TAX_FAQS } from './content';

export function IncomeTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-income-tax-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Income Tax Calculator estimates US federal income tax for tax years 2025 and 2026
        from wages, other income, withholdings, dependents, and common deductions and credits.
        It applies progressive ordinary brackets, preferential rates for qualified dividends and
        long-term capital gains, the larger of the standard or itemized deduction, and selected
 credits. Results are educational estimates in fixed USD; not a filed return.
      </p>

      <h2
        id="income-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Estimate Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross / reported income → above-the-line adjustments → AGI</p>
        <p>Taxable income = AGI − max(standard deduction, itemized deductions)</p>
        <p>Tax = ordinary brackets on ordinary taxable income + preferential stack on QD/LTCG</p>
        <p>Net tax ≈ tax − nonrefundable credits − refundable credits</p>
        <p>Refund or owed = federal withholding − net tax</p>
        <p>Effective rate = max(0, net tax) ÷ AGI</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Official references include IRS Rev. Proc. 2024-40, Rev. Proc. 2025-32, IR-2025-103,
        Pub. 915, Schedule 8812, Form 2441, Form 8863, and OBBBA (P.L. 119-21). Year-specific
        thresholds stay separate for 2025 and 2026.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Single · age 30 · tax year 2025 · $80,000 wages · $9,000 federal withheld · no dependents</p>
        <p>Standard deduction $15,750 → taxable income $64,250</p>
        <p>Ordinary tax on $64,250 using 2025 single brackets → credits $0 → compare to $9,000 withheld</p>
        <p>Result shows estimated refund or additional tax owed, plus AGI and effective rate</p>
      </div>

      <h2
        id="income-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INCOME_TAX_FAQS]} />
      </div>
    </article>
  );
}
