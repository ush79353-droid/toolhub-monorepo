import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEBT_SNOWBALL_FAQS } from './content';

export function DebtSnowballGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-debt-snowball"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Debt Snowball Method?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The debt snowball method focuses on clearing the smallest balances first while you keep
        paying the required minimum on every other debt. Each time a balance hits zero, that freed
        payment rolls into the next-smallest debt, growing the attack payment like a snowball.
      </p>

      <h2
        id="snowball-vs-avalanche"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Snowball vs Avalanche
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Both strategies use the same overall monthly budget for a fair comparison. Snowball ranks
        by outstanding balance; avalanche ranks by interest rate. Minimum payment keeps each debt
        on its own schedule, so the combined payment can fall as individual debts retire.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Debt #1: 1,500 at 2.5% with a 120 minimum</p>
        <p>Debt #2: 4,000 at 6.2% with a 150 minimum</p>
        <p>Combined budget 270 with no extra increase</p>
        <p className="mt-2">
          Minimum payoff ≈ 29 months and ≈ 336.47 interest. Snowball payoff ≈ 22 months and ≈
          291.30 interest under the same 270 monthly budget.
        </p>
      </div>

      <h2
        id="debt-snowball-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEBT_SNOWBALL_FAQS]} />
      </div>
    </article>
  );
}
