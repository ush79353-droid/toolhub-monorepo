import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LEVERED_FCF_FAQS } from './content';

export function LeveredFreeCashFlowGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-levered-fcf"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Levered Free Cash Flow?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Levered free cash flow is a cash-flow estimate after capital spending,
        working-capital investment, and mandatory debt repayments. This calculator
        uses a simplified EBITDA-based model for quick scenario checks. It is not
        a complete free cash flow to equity (FCFE) calculation: EBITDA excludes
        cash interest and taxes, so do not treat the result as cash available to
        equity unless those effects are accounted for separately.
      </p>

      <h2
        id="levered-fcf-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Levered FCF Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Levered FCF = EBITDA − CapEx − ΔWC − Debt repayments</p>
        <p className="mt-2 text-xs text-muted-foreground">
          CapEx and mandatory debt repayments are positive outflows · ΔWC may be
          negative · result may be negative
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a simplified cash-flow estimate. It does not invent taxes,
        interest, or other FCFE adjustments that are absent from the reference
        inputs.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>EBITDA = 500,000 PKR</p>
        <p>Capital expenditures = 120,000 PKR</p>
        <p>Net change in working capital = 30,000 PKR</p>
        <p>Mandatory debt repayments = 50,000 PKR</p>
        <p>
          Levered FCF = 500,000 − 120,000 − 30,000 − 50,000 = 300,000 PKR
        </p>
      </div>

      <h2
        id="levered-fcf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LEVERED_FCF_FAQS]} />
      </div>
    </article>
  );
}
