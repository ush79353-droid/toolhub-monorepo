import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VARIABLE_ANNUITY_FAQS } from './content';

export function VariableAnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-variable-annuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Variable Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A variable annuity accumulates value from an opening balance and recurring contributions at a
        stated expected return. This calculator estimates the final balance at withdrawal age, with an
        optional taxable-account comparison using published US federal ordinary income brackets.
      </p>

      <h2
        id="variable-annuity-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + r/m)^(m/q) − 1</p>
        <p>g = (1 + G)^(1/q) − 1</p>
        <p>FV_principal = PV × (1+i)^n</p>
        <p>FV_payments (ordinary) = PMT × ((1+i)^n − (1+g)^n) / (i − g)</p>
        <p>FV_payments (due) = FV_payments (ordinary) × (1+i)</p>
        <p>Final balance before tax = FV_principal + FV_payments</p>
      </div>

      <h2
        id="tax-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Assumptions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The taxable estimate applies published IRS tax-year 2024 Single ordinary brackets (Rev. Proc.
        2023-34) to each year’s investment gain only. Brackets inflate with the inflation rate you
        enter; ordinary income grows with the income-growth rate. No brackets or rates are invented
        beyond that published schedule. This is an educational estimate, not tax advice, and it may
        differ from third-party calculators that use other tax years or proprietary models.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Start 10,000 · contribute 100 monthly · due · 12% yearly compounding · 35 years</p>
        <p>Period rate i = 1.12^(1/12) − 1 · n = 420</p>
        <p>Final balance before tax ≈ 1,079,079.31 · contributions 420 · total contributed 42,000</p>
      </div>

      <h2
        id="variable-annuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...VARIABLE_ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
