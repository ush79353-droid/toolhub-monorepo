import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_AVALANCHE_FAQS } from './content';

export function DebtAvalancheGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-debt-avalanche"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Debt Avalanche Method?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The debt avalanche method prioritizes the highest interest rate after each debt is
        paid off, while keeping your combined monthly payment budget constant. Compared with
        paying only the original minimum on each balance, that reallocation can cut interest
        and shorten the overall payoff.
      </p>

      <h2
        id="avalanche-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How This Calculator Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total debt = sum of balances</p>
        <p>Monthly interest on a debt = balance × (APR/100)/12</p>
        <p>Baseline: each debt paid only with its own fixed monthly payment</p>
        <p>
          Avalanche: pay minimums, then apply remaining budget to the highest-APR balance;
          keep total monthly budget after a payoff
        </p>
        <p>Baseline APR = Σ(balance × APR) / Σ(balance)</p>
        <p>Avalanche APR ≈ total interest / (average opening balance × years)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Debt #1 = 1,000 PKR @ 6% / 100 PKR · Debt #2 = 5,000 PKR @ 12% / 200 PKR</p>
        <p>
          Baseline ≈ 29 months · interest ≈ 810.92 · Avalanche ≈ 23 months · interest ≈
          693.71 · save ≈ 117.21 and 6 months
        </p>
      </div>

      <h2
        id="debt-avalanche-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_AVALANCHE_FAQS]} />
      </div>
    </article>
  );
}
