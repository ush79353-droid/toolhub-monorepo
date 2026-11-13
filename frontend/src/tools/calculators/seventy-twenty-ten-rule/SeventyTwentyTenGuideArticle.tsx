import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SEVENTY_TWENTY_TEN_FAQS } from './content';

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: 'what-is-70-20-10',
    title: 'What Is the 70/20/10 Rule?',
    body: [
      'The 70/20/10 rule is a simple way to divide after-tax income into three jobs. About 70% covers needs, 20% goes to savings and debt repayment, and 10% is left for lifestyle spending. People use it when they want a starting plan without building a budget line for every purchase.',
      'It is a guideline. A household with a high rent, several dependents, or a large debt payment may not be able to hit these shares, and that does not mean the household has failed. The useful question is whether the split you choose matches the cash you actually have.',
    ],
  },
  {
    id: 'how-the-rule-works',
    title: 'How the Rule Works',
    body: [
      'Start with income after tax for one period, usually a month or a year. Multiply that income by 0.70, 0.20, and 0.10. The three results are the recommended ceilings, not a record of what you already spent.',
      'Then enter what you actually spent in the same period. The gap between the ceiling and the actual amount is either money still unassigned or money already over that ceiling. Savings and debt repayment sit in their own bucket so they are not mixed with groceries or with dining out.',
    ],
  },
  {
    id: 'calculate-each-category',
    title: 'How to Calculate Each Category',
    body: [
      'Needs = after-tax income × 0.70. Savings and debt = after-tax income × 0.20. Lifestyle = after-tax income × 0.10. On 100,000 of monthly after-tax income, those figures are 70,000, 20,000, and 10,000.',
      'If you change the shares, the three percentages still have to add up to 100%. This page rounds each share to the currency’s usual fraction digits and puts any leftover unit on the lifestyle amount, so the three budgets add back to the income you entered.',
    ],
  },
  {
    id: 'monthly-and-annual-examples',
    title: 'Monthly and Annual Examples',
    body: [
      'Monthly: 100,000 after tax. Needs 70,000, savings and debt 20,000, lifestyle 10,000. The same plan for a year is 1,200,000 of income, with 840,000, 240,000, and 120,000 in the three categories.',
      'Annual first: 1,200,000 after tax is 100,000 a month. Switching the frequency control divides or multiplies every amount you typed, once. It does not take a monthly figure, annualize it, and then annualize it again.',
    ],
  },
  {
    id: 'what-belongs-where',
    title: 'What Belongs in Each Category',
    body: [
      'Needs are the costs that keep the household running: housing, utilities, basic groceries, transport to work, insurance, and childcare you cannot drop. A want that is easy to pause, such as a streaming subscription or a restaurant meal, belongs in lifestyle even if it feels routine.',
      'Savings and debt repayment are money you are setting aside or sending to a balance you owe. An emergency-fund transfer and an extra loan payment both belong here. The minimum payment on a loan is still repayment, so this split keeps it out of the lifestyle 10%.',
    ],
  },
  {
    id: 'compare-actual-spending',
    title: 'Compare Actual Spending',
    body: [
      'For each category, remaining budget = allocated amount − actual spending. Usage is actual spending divided by the allocation. If the allocation is zero, that ratio is not shown, because dividing by zero is not a percentage.',
      'Add the three actual amounts. Subtract that total from after-tax income. A positive remainder is income you have not assigned. A negative remainder is overspending. A category can be under its own ceiling while the household is still over income, if another category ran past its share.',
    ],
  },
  {
    id: 'advantages-and-limits',
    title: 'Advantages and Limitations',
    body: [
      'The rule is quick, and the 20% savings-and-debt share makes saving visible. Three buckets are easier to remember than a long spreadsheet. Comparing actual spending with those buckets shows which part of the plan slipped.',
      'The shares ignore local rent, family size, and debts that already consume more than 20%. They also ignore tax refunds, one-off medical bills, and money that arrives on an uneven schedule. A tidy percentage is not evidence that the plan is affordable.',
    ],
  },
  {
    id: 'versus-50-30-20',
    title: '70/20/10 vs 50/30/20',
    body: [
      'The 50/30/20 guideline puts 50% toward needs, 30% toward wants, and 20% toward savings and debt. The 70/20/10 guideline allows more for needs and much less for lifestyle, and it keeps the same 20% for savings and debt.',
      'Neither split is the correct one. A city with expensive housing may need more than 50% for needs. A household that wants more room for travel may not accept a 10% lifestyle cap. Use the custom percentages when you want a different mix, and keep the total at 100%.',
    ],
  },
  {
    id: 'irregular-income',
    title: 'Irregular Income',
    body: [
      'If pay changes from month to month, a single month can make the percentages look broken. One approach is to budget from a conservative month, or from the average of several months, and to park extra pay in the savings bucket instead of raising lifestyle spending immediately.',
      'Annual mode can help when you know a yearly total better than a monthly one. Divide that year by 12 only for a typical month, and keep a separate reserve for the months that come in low. This calculator converts the amounts you enter. It does not forecast next month’s pay.',
    ],
  },
];

export function SeventyTwentyTenGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
        <section id="budget-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">Frequently Asked Questions</h2>
          <div className="mt-4">
            <FAQAccordion items={SEVENTY_TWENTY_TEN_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
