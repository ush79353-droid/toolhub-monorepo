import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOTTERY_ANNUITY_FAQS } from './content';

export function LotteryAnnuityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-lottery-annuity"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Lottery Annuity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many jackpots can be taken as a long series of annual payments that increase each year
        (a growing annuity). This calculator treats the entered prize as the present value of
        that stream, solves for the first payout, then builds the year-by-year schedule.
      </p>

      <h2
        id="lottery-annuity-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Lottery Annuity Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Payout_year = First_Payout × (1 + g)^(year − 1)</p>
        <p className="mt-2">
          When r ≠ g: First_Payout = PV × (r − g) / (1 − ((1+g)/(1+r))^n)
        </p>
        <p className="mt-2">When r = g: First_Payout = PV × (1 + r) / n</p>
        <p className="mt-2">When r = 0 and g ≠ 0: First_Payout = PV × g / ((1+g)^n − 1)</p>
        <p className="mt-2">When r = 0 and g = 0: First_Payout = PV / n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Prize = 1,000,000 · Years = 30 · Growth = 5% · Return = 0% · Without tax</p>
        <p>First payout ≈ 15,051.74</p>
        <p>Year 2 ≈ 15,804.33 · payments grow 5% each year for 30 years</p>
      </div>

      <h2
        id="lottery-annuity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LOTTERY_ANNUITY_FAQS]} />
      </div>
    </article>
  );
}
