import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BUSINESS_BUDGET_FAQS } from './content';

const sections: { id: string; title: string; body: string[]; formula?: string }[] = [
  {
    id: 'what-business-budget',
    title: 'What This Calculator Does',
    body: [
      'This worksheet estimates a simple business budget: operating and non-operating income, one-time startup costs, salaries, and recurring monthly expenses. Summary totals show monthly income, monthly recurring expenses, and the resulting budget balance.',
    ],
  },
  {
    id: 'business-budget-formulas',
    title: 'Formulas',
    body: [
      'Income and recurring expense lines are converted to monthly equivalents, then summed by section. One-time costs feed Initial investment only.',
    ],
    formula:
      'Total income = Operating + Non-operating  |  Total expenses = Salaries + Monthly expenses  |  Budget balance = Total income − Total expenses  |  Initial investment = One-time costs',
  },
  {
    id: 'business-budget-periods',
    title: 'Periods & One-time Costs',
    body: [
      'Use the period control on each recurring line (/ day, / wk, / mo, / yr). Totals are shown per month. One-time costs have no period and are treated as startup capital, not as another monthly expense line.',
    ],
  },
  {
    id: 'business-budget-example',
    title: 'Example',
    body: [
      'Income 1 = 10,000 / mo and Income 2 = 12,000 / yr → operating income 11,000 / mo. Interest 600 / yr and dividends 100 / mo → non-operating 150 / mo. Manager salary 2,000 / mo, rent 1,500 / mo, utilities 1,200 / yr → expenses 3,600 / mo. Furniture 5,000 + starting inventory 3,000 → initial investment 8,000. Budget balance = 11,150 − 3,600 = 7,550 / mo.',
    ],
  },
];

export function BusinessBudgetGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">{section.formula}</p>
              </div>
            ) : null}
          </article>
        ))}
        <section id="business-budget-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={BUSINESS_BUDGET_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
