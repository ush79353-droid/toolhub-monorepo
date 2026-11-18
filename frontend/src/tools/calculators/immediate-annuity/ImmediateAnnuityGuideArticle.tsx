import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IMMEDIATE_ANNUITY_FAQS } from './content';

export function ImmediateAnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-immediate-annuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Immediate Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An immediate annuity turns a lump-sum investment into periodic withdrawals
        that can start right away. Use this calculator to solve for withdrawal size,
        required investment, duration, needed return, or remaining balance — then
        review the yearly schedule.
      </p>

      <h2
        id="immediate-annuity-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Calculator Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Period rate i = (1 + r/m)^(m/q) − 1</p>
        <p>Default compounding matches payment frequency when the checkbox is off</p>
        <p>Annuity due: withdraw at period start, then apply interest</p>
        <p>Ordinary: apply interest, then withdraw at period end</p>
        <p>Optional growth: each withdrawal scales by (1+g) each period</p>
        <p>Totals and last withdrawal date come from the full schedule</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Invest PKR 100,000 · 10 years · 1.5% · Monthly · Beginning of periods
        </p>
        <p>Monthly withdrawal ≈ PKR 896.79 · 120 withdrawals</p>
        <p>Total withdrawals ≈ PKR 107,615.28 · Total return ≈ PKR 7,615.28</p>
        <p>Final balance PKR 0.00 · Last withdrawal about 10 years later</p>
      </div>

      <h2
        id="immediate-annuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...IMMEDIATE_ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
