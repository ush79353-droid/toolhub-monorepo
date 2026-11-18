import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUTURE_VALUE_OF_ANNUITY_FAQS } from './content';

export function FutureValueOfAnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fva"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Future Value of an Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The future value of an annuity is the compounded value of a series of equal payments made
        at regular intervals. This calculator converts your nominal annual rate into a payment-period
        rate, applies ordinary or due timing, and optionally grows each payment.
      </p>

      <h2
        id="fva-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + r/m)^(m/q) − 1 (discrete) · i = e^(r/q) − 1 (continuous)</p>
        <p className="mt-2">n = round(term years × payments per year)</p>
        <p className="mt-2">Ordinary (g = 0): FV = PMT × ((1 + i)^n − 1) / i</p>
        <p className="mt-2">Annuity due: FV_due = FV_ordinary × (1 + i)</p>
        <p className="mt-2">Zero interest: FV = PMT × n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Payment 100 · rate 5% · term 3 years · yearly compounding &amp; payments · ordinary</p>
        <p>i = 5% · n = 3 · FV = 100 × ((1.05)^3 − 1) / 0.05 = 315.25</p>
        <p>Annuity due: 315.25 × 1.05 = 331.0125</p>
      </div>

      <h2
        id="fva-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FUTURE_VALUE_OF_ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
