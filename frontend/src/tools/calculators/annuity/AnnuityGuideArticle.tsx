import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANNUITY_FAQS } from './content';

export function AnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-an-annuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 An annuity is a series of equal-interval payments: deposits into savings or
 withdrawals from a balance; that earn a stated rate of return. Ordinary annuities
        pay at the end of each period; annuity due pays at the beginning. This calculator
        models fixed immediate annuities with optional payment growth.
      </p>

      <h2
        id="annuity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annuity Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Period rate: i = (1 + r/m)^(m/q) − 1</p>
        <p className="mt-2">Growing ordinary FV (g ≠ i):</p>
        <p>FV = P × [(1+i)^n − (1+g)^n] / (i − g)</p>
        <p className="mt-2">When g = i: FV = P × n × (1+i)^(n−1)</p>
        <p className="mt-2">Annuity due: multiply the ordinary FV factor by (1+i)</p>
        <p className="mt-2">Plus opening balance grown: PV × (1+i)^n</p>
        <p className="mt-2">
          Results and dates are derived from a full-precision payment schedule.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Deposit PKR 1,000 monthly for 6 years at 5% (monthly compounding), annuity due,
          opening balance 0, no growth.
        </p>
        <p>n = 72 · i = 0.05/12</p>
        <p>Final balance ≈ PKR 84,113.28</p>
        <p>Total deposits = 72,000 · Total return ≈ 12,113.28</p>
      </div>

      <h2
        id="annuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
