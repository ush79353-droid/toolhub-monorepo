import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GROWING_ANNUITY_FAQS } from './content';

export function GrowingAnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-growing-annuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Growing Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A growing annuity is a series of cash flows that change at a constant growth rate each
        period. This calculator projects or solves for present value, future value, or the first
        payment when deposits or withdrawals grow over time, with ordinary or due timing and
        independent currencies on money fields.
      </p>

      <h2
        id="growing-annuity-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + r/m)^(m/q) − 1</p>
        <p>g = (1 + G)^(1/q) − 1</p>
        <p>Each period k: payment = PMT × (1+g)^k</p>
        <p>Annuity due: add payment, then apply (1+i)</p>
        <p>Ordinary annuity: apply (1+i), then add payment</p>
        <p>Total payments = PMT × ((1+g)^n − 1) / g (or PMT × n when g = 0)</p>
        <p>Total return = FV − opening − net contributions</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Solve FV · deposit · monthly / annuity due / monthly compounding · opening 0 · PMT
          1,000 · 6 years · 5% return · 3% annual growth
        </p>
        <p>
          Periodic growth ≈ 0.24663% · 72 deposits · FV ≈ 91,514.60 · total deposits ≈ 78,682.51 ·
          total return ≈ 12,832.09
        </p>
      </div>

      <h2
        id="growing-annuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GROWING_ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
