import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FOUR_ZERO_ONE_K_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-401k', label: 'What a 401(k) is' },
  { id: 'how-a-401k-works', label: 'How a 401(k) works' },
  { id: 'calculate-savings', label: 'How to calculate savings' },
  { id: 'employee-contributions', label: 'Employee contributions' },
  { id: 'employer-matching', label: 'Employer matching' },
  { id: 'traditional-vs-roth', label: 'Traditional vs Roth' },
  { id: 'compound-growth', label: 'Compound growth' },
  { id: 'limits-and-catch-up', label: 'Limits and catch-up' },
  { id: 'how-much-to-contribute', label: 'How much to contribute' },
  { id: '401k-vs-403b', label: '401(k) vs 403(b)' },
  { id: 'inflation', label: 'Inflation' },
  { id: 'withdrawals', label: 'Withdrawals' },
  { id: 'common-mistakes', label: 'Common mistakes' },
  { id: '401k-faq', label: 'Frequently asked questions' },
];

export interface FourZeroOneKGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const FOUR_ZERO_ONE_K_GUIDE_SECTIONS: readonly FourZeroOneKGuideSection[] = [
  {
    id: 'what-is-a-401k',
    title: 'What a 401(k) is',
    paragraphs: [
      'A 401(k) is a workplace retirement account offered by many private employers in the United States. You choose how much of your pay to defer, the employer may add a match or another contribution, and the balance then rises or falls with the investments you select and the fees the plan charges.',
      'The plan document decides who is eligible, which funds are available, how matching works, and when employer money vests. This page projects a balance from the numbers you type. It does not look up your plan, your investments, or your tax return.',
    ],
  },
  {
    id: 'how-a-401k-works',
    title: 'How a 401(k) works',
    paragraphs: [
      'Each contribution period, the calculator takes that year’s salary, computes the employee deposit, then the employer deposit, applies any limits you turned on, and updates the balance. Beginning-of-period deposits are invested for that period. End-of-period deposits earn nothing until the next one.',
      'The default example is a partial match: 6% of an $80,000 salary is $4,800 from the employee, and a 50% match on that first 6% is $2,400 from the employer. Choose “No employer matching” when the plan does not match.',
    ],
  },
  {
    id: 'calculate-savings',
    title: 'How to calculate 401(k) savings',
    paragraphs: [
      'Projected-balance mode runs the schedule from the current balance to the retirement age you enter. Contribution-needed mode searches for the lowest employee percent, or the lowest starting dollar amount, that reaches a nominal target. Matching is recalculated for each candidate, and any limit you entered still applies.',
      'If the highest allowed contribution still misses the target, the result says the target is out of reach and shows that ceiling. It does not invent a contribution that the inputs cannot support. A retirement age that is not after the current age produces no result.',
    ],
    formula: 'Salary in year N = starting salary × (1 + salary growth)^N',
    formulaNote: 'Year 0 uses the salary you typed. An optional cap is applied after growth.',
  },
  {
    id: 'employee-contributions',
    title: 'Employee contributions',
    paragraphs: [
      'A percent contribution is that year’s salary times the percent. A yearly increase of 1 percentage point turns 6% into 7% the next year, and the percent never goes above 100%. A fixed contribution is a dollar amount for the year. Its optional growth is a percent change in those dollars, not extra percentage points of salary.',
      'The annual total is split across monthly, biweekly, or annual periods. A leftover cent is assigned to the earliest periods so the year still adds up. Frequency changes when the money is invested. It does not change the annual total by itself.',
    ],
  },
  {
    id: 'employer-matching',
    title: 'Employer matching',
    paragraphs: [
      'Matching is optional. Dollar-for-dollar means the employer adds $1 for each $1 you defer, up to the salary percent you enter. Partial matching uses the match rate you enter on that same eligible slice. If you defer less than the slice, only the amount you deferred is matched.',
      'A fixed employer percent is not a match. It is a share of salary even when you contribute nothing. The extra employer amount is a flat annual dollar deposit that does not grow. Vesting is one percent for the whole projection. Only the vested share enters the balance. Unvested employer dollars are still shown, and they still count toward an annual-additions cap if you entered one. This is not a year-by-year vesting schedule.',
    ],
    formula: 'Employer match = min(employee deferral, salary × eligible percent) × match rate',
    formulaNote: '$80,000 × 6% = $4,800. Half of that is $2,400. A 10% deferral is still matched only on the first 6% when that is the cap you entered.',
  },
  {
    id: 'traditional-vs-roth',
    title: 'Traditional vs Roth 401(k)',
    paragraphs: [
      'A traditional deferral is generally pre-tax. It usually reduces taxable wages today, and withdrawals in retirement are typically taxed as ordinary income. A Roth deferral is generally after-tax. Qualified Roth distributions can be tax-free when the tax rules are met.',
      'This projection does not compute either tax. Traditional and Roth produce the same balance here when the dollars deposited, the return, and the fees are the same. The cash you give up to make an after-tax Roth deposit can be higher than the cash you give up for the same traditional deposit. Employer contributions often have their own tax treatment under the plan. Do not treat the whole balance as Roth because you selected that label.',
    ],
  },
  {
    id: 'compound-growth',
    title: 'Compound growth',
    paragraphs: [
      'The return is an effective annual rate. The period rate is (1 + annual return) raised to 1 divided by the number of periods, minus 1. A negative return is allowed down to just above −100%. Fees use the same convention and are subtracted from the invested balance. Growth and fees are reported on separate lines.',
      'Starting balance + employee deposits + vested employer deposits + investment growth − fees equals the ending balance, to the cent. If that identity cannot be kept, the calculator shows no result instead of a broken total.',
    ],
    formula: 'Period rate = (1 + annual return) ^ (1 / periods per year) − 1',
    formulaNote: 'Monthly, biweekly, and annual schedules all use this identity. The rate itself is not rounded.',
  },
  {
    id: 'limits-and-catch-up',
    title: 'Limits and catch-up',
    paragraphs: [
      'Elective-deferral limits, catch-up amounts, and annual-additions limits are set for a tax year and then updated. This calculator does not store a published table and does not guess next year’s cap. Limits stay off until you enter the dollars for the year you want to model.',
      'The elective limit caps the employee deferral. A catch-up amount, if you enter both an age and an amount, is added in any projection year whose starting age is at least that age. The annual-additions limit, if you enter one, caps employee plus employer dollars, and employer money is reduced first. Those dollar caps stay in US dollars. If the display currency is not USD, turn limits off. This page does not convert a statutory dollar cap.',
    ],
  },
  {
    id: 'how-much-to-contribute',
    title: 'How much to contribute',
    paragraphs: [
      'There is no single correct percent. A match that stops at 6% of salary is a common reason to defer at least that much, because unmatched dollars are left on the table. Beyond the match, the useful question is the balance you want and the return you are willing to assume.',
      'Contribution-needed mode answers that question under the match, growth, fees, and limits you entered. Raise the return and the required contribution falls. That is the assumption doing the work, not a promise from the market.',
    ],
  },
  {
    id: '401k-vs-403b',
    title: '401(k) vs 403(b)',
    paragraphs: [
      'A 401(k) is the plan private employers usually offer. A 403(b) is aimed at public schools and many tax-exempt organizations. Both can take employee deferrals, both can include employer money, and both can offer traditional and Roth accounts. The match formula, the investment menu, and some catch-up rules differ by plan.',
      'A long-service catch-up is a 403(b) feature and is not modeled here as an automatic rule. Someone with both a 401(k) and a 403(b) may face a combined limit. This page models one 401(k) from the inputs you type.',
    ],
  },
  {
    id: 'inflation',
    title: 'How inflation affects retirement savings',
    paragraphs: [
      'The projected balance is nominal. Inflation does not change the deposits or the investment return. The inflation-adjusted figure divides that nominal balance by (1 + inflation) raised to the number of years, so you can compare it with today’s prices.',
      'A 2% inflation assumption over 30 years is a large gap between the two numbers. Read them as two different results. Neither one is a guaranteed future price level.',
    ],
  },
  {
    id: 'withdrawals',
    title: '401(k) withdrawal considerations',
    paragraphs: [
      'An optional withdrawal rate, such as 4%, multiplies the projected nominal balance and divides that amount by 12. That is a planning sketch. It is not a determination that the income will last, and it is not a tax calculation.',
      'Actual withdrawals can be taxed, penalized if taken early, or required later under rules that depend on the tax year, the account type, and your age. Those rules are not applied here because a fixed percentage does not contain enough information to compute them.',
    ],
    formula: 'Annual withdrawal = projected balance × withdrawal rate',
    formulaNote: 'Monthly withdrawal = annual withdrawal / 12. The rate is an illustration you enter, not a recommended drawdown.',
  },
  {
    id: 'common-mistakes',
    title: 'Common retirement planning mistakes',
    paragraphs: [
      'Treating the projected balance as a forecast the market owes you. A small change in the return compounds across decades. Include a fee, and run a lower return before you rely on the figure.',
      'Assuming every employer matches, pasting an old contribution limit into a 30-year run, or changing the currency and expecting the dollars to convert. The currency control changes the symbol and grouping. US limit checks stay in USD. Mixing a percent deferral and a fixed deferral is also a mistake this form avoids: one basis is active at a time.',
    ],
  },
];

export const FOUR_ZERO_ONE_K_FAQS: readonly FAQItem[] = [
  {
    question: 'Is the projected 401(k) balance guaranteed?',
    answer:
      'No. It is the balance produced by the salary, contributions, return, fees, and limits you entered. Markets, plan rules, and future contribution caps can all differ.',
  },
  {
    question: 'Does every 401(k) include an employer match?',
    answer:
      'No. Some plans match nothing. Some match a portion of what you defer up to a salary cap. Some deposit a fixed percent of salary. Use the formula in your plan, or choose no matching.',
  },
  {
    question: 'Why are IRS limits not filled in?',
    answer:
      'Elective-deferral limits, catch-up amounts, and annual-additions limits change by tax year. Enter the published USD figures for the year you want to model, or leave the limit switch off.',
  },
  {
    question: 'Does Roth change the projected balance?',
    answer:
      'Not here. Traditional and Roth change the tax treatment of contributions and withdrawals. The same deposited dollars, return, and fees produce the same account balance in this projection.',
  },
  {
    question: 'What if the target cannot be reached?',
    answer:
      'Contribution-needed mode searches up to 100% of salary, or up to the largest dollar amount this page allows, after any limit you entered. If that ceiling still misses the target, the page says so and shows the ceiling instead of a made-up contribution.',
  },
  {
    question: 'Does changing the currency convert my savings?',
    answer:
      'No. Amounts you type are already in the selected currency. The control changes the symbol and number formatting. US statutory limits are checked only while the currency is USD.',
  },
];
