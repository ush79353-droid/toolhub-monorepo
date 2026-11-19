import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AUTO_LEASE_FAQS } from './content';

export function AutoLeaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-auto-lease-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an auto lease payment from vehicle price, term, money factor (or APR), down
        payment, trade-in, residual value, and sales tax—or solve for the auto price that fits a
        target monthly payment. Amounts are shown in USD. This is an educational estimate, not a
        dealer quote.
      </p>

      <h2
        id="auto-lease-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Adjusted capitalized cost = Auto price − Down payment − Trade-in</p>
        <p>Monthly depreciation = (Capitalized cost − Residual) / Lease months</p>
        <p>Monthly finance charge = (Capitalized cost + Residual) × Money factor</p>
        <p>Base monthly payment = Depreciation + Finance charge</p>
        <p>Monthly payment = Base × (1 + Sales tax / 100)</p>
        <p>Money factor ≈ APR (%) / 2400</p>
        <p>Total lease payments = Monthly payment × Lease months</p>
        <p>Total lease cost = Total lease payments + Down payment</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Auto price $50,000 · Term 36 months · Money factor 0.00208 · Down $10,000 · Trade-in $0 · Tax 7% · Residual $24,000</p>
        <p>Capitalized cost = 50,000 − 10,000 − 0 = 40,000</p>
        <p>Depreciation / mo = (40,000 − 24,000) / 36 ≈ 444.4444</p>
        <p>Finance / mo = (40,000 + 24,000) × 0.00208 = 133.12</p>
        <p>Base = 577.5644 → Payment ≈ 577.5644 × 1.07 ≈ $617.99</p>
      </div>

      <h2
        id="auto-lease-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...AUTO_LEASE_FAQS]} />
      </div>
    </article>
  );
}
