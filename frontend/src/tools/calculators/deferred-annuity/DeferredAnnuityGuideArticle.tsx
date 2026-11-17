import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEFERRED_ANNUITY_FAQS } from './content';

export function DeferredAnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-deferred-annuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Deferred Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A deferred annuity accumulates a lump sum and optional monthly contributions for a
        waiting period, then pays regular withdrawals that deplete the balance over a chosen
        payout length. This calculator estimates the balance when withdrawals begin, the
        sustainable monthly withdrawal, totals, and the last withdrawal date.
      </p>

      <h2
        id="deferred-annuity-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Accumulation and Payout Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly rate r = annual% / 1200</p>
        <p className="mt-2">
          Accumulation: FV = PV(1+r)^n + PMT × ((1+r)^n − 1) / r · zero r → PV + PMT×n
        </p>
        <p className="mt-2">
          Withdrawal: a = FV × r / (1 − (1+r)^(−m)) · zero r → FV / m
        </p>
        <p className="mt-2">
          Total contribution (table) = PMT × n · Total return = total withdrawals − PV − PMT×n
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Lump sum = 20,000 · Monthly contribution = 500 · Acc. rate = 1.5%</p>
        <p>Deferral ≈ 15 years (180 months) · Payout = 20 years · Payout rate = 1.5%</p>
        <p>Balance at first withdrawal ≈ 125,901.64 · Monthly withdrawal ≈ 607.53</p>
        <p>Total contribution (monthly deposits) = 90,000 · 240 withdrawals</p>
      </div>

      <h2
        id="deferred-annuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEFERRED_ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
