import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PH_INCOME_TAX_FAQS } from './content';

export function PhilippinesIncomeTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-ph-income-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income Tax Philippines Calculator estimates monthly mandatory contributions and income tax
        for private-sector employed or self-employed individuals in Philippine pesos. Enter monthly
        income, then read SSS, PhilHealth, Pag-IBIG, taxable income, tax, and net pay. It is an
        illustrative payroll/self-employed sketch — not a BIR filing, payslip, or official agency
        computation.
      </p>

      <h2
        id="ph-income-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual income = Monthly income × 12</p>
        <p className="mt-2">
          Taxable income (monthly) = Monthly income − applicable member contributions
        </p>
        <p className="mt-2">
          Employed tax = BIR monthly withholding table on taxable compensation
        </p>
        <p className="mt-2">
          Self-employed tax ≈ Annual graduated tax(taxable × 12) ÷ 12
        </p>
        <p className="mt-2">Net pay after tax = Monthly income − tax</p>
        <p className="mt-2">
          Net pay after deductions = Monthly income − (tax + contributions)
        </p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        CY 2025 sources: BIR TRAIN schedules (RR 11-2018 Annex E; RMC 34-2025 Table 2), SSS
        Circulars 2024-006 and 2024-008, PhilHealth Advisory 2025-0002, Pag-IBIG Circular 460.
      </p>

      <h2
        id="employed-vs-self-employed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Employed vs Self-Employed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Employed mode deducts only employee shares and applies payroll withholding. Self-employed
        mode uses member-paid SSS (15% of MSC), full PhilHealth premium, and Pag-IBIG employee plus
        employer counterparts, with estimated graduated tax — never silent employee withholding
        rules.
      </p>

      <h2
        id="ph-income-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PH_INCOME_TAX_FAQS]} />
      </div>
    </article>
  );
}
