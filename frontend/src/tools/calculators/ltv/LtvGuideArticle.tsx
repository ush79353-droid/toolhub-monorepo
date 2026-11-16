import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LTV_FAQS } from './content';

export function LtvGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-ltv" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Loan to Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Loan-to-value (LTV) compares the financed amount to the purchase price or appraised value.
        Lenders use it as a risk signal; higher LTV generally means less borrower equity.
      </p>

      <h2
        id="ltv-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        LTV Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan amount = Purchase price − Down payment</p>
        <p>Down payment = Purchase price − Loan amount</p>
        <p>LTV (%) = (Loan amount / Purchase price) × 100</p>
        <p>Loan amount = Purchase price × (LTV / 100)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Purchase 200,000 · Down 40,000 → Loan 160,000 · LTV 80%</p>
        <p>Purchase 200,000 · Loan 180,000 → Down 20,000 · LTV 90%</p>
      </div>

      <h2 id="ltv-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LTV_FAQS]} />
      </div>
    </article>
  );
}
