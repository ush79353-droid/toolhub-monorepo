import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FOUR_ZERO_THREE_B_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-403b', label: 'What a 403(b) plan is' },
  { id: 'how-contributions-work', label: 'How contributions work' },
  { id: 'employer-matching', label: 'Employer matching' },
  { id: 'traditional-vs-roth', label: 'Traditional vs Roth' },
  { id: 'growth-and-compounding', label: 'Growth and compounding' },
  { id: 'limits-and-catch-up', label: 'Limits and catch-up' },
  { id: 'estimating-savings', label: 'How to estimate savings' },
  { id: '403b-vs-401k', label: '403(b) vs 401(k)' },
  { id: 'common-mistakes', label: 'Common planning mistakes' },
  { id: '403b-faq', label: 'Frequently asked questions' },
];

export interface FourZeroThreeBGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const FOUR_ZERO_THREE_B_GUIDE_SECTIONS: readonly FourZeroThreeBGuideSection[] = [
  {
    id: 'what-is-a-403b',
    title: 'What a 403(b) plan is',
    paragraphs: [
      'A 403(b) plan is a retirement plan for employees of public schools and many tax-exempt organizations. You defer part of your pay into an account, the employer may add money of its own, and the balance changes with investment returns and fees.',
      'The name comes from the section of the U.S. tax code that describes the plan. Eligibility, the investment menu, and any employer deposit are set by that employer’s written plan. A calculator can project a balance from assumptions. It cannot tell you whether you are eligible or which funds your plan offers.',
      'Nothing on this page is tax, legal, or investment advice. Plan documents and a qualified adviser outrank a projection.',
    ],
  },
  {
    id: 'how-contributions-work',
    title: 'How contributions work',
    paragraphs: [
      'An employee contribution is either a percent of that year’s gross salary or a fixed dollar amount for the year. Salary can grow once each anniversary. A percent deferral then grows with the salary. A fixed amount stays flat unless you also enter a yearly increase.',
      'The annual amount is split evenly across the periods you choose: 12 monthly deposits, 26 biweekly deposits, or one yearly deposit. A leftover cent is placed on the earliest periods so the year’s total stays exact.',
      'Deposits at the beginning of a period are invested for that period. Deposits at the end earn nothing until the next period. The default on this page is the end of the period.',
    ],
    formula: 'Employee deferral = that year’s salary × deferral percent',
    formulaNote: 'Or a fixed annual amount, split across the periods in the year. The two methods are not added together.',
  },
  {
    id: 'employer-matching',
    title: 'Employer matching',
    paragraphs: [
      'Many 403(b) plans have no employer contribution at all. Do not assume a match. When a plan does contribute, the formula is whatever the plan document says. This calculator covers three common shapes: no contribution, a percent of the employee’s deferral up to a cap, and a fixed percent of salary that does not depend on the employee.',
      'Dollar-for-dollar up to 6% of salary is a match rate of 100% and a cap of 6%. A match of 50% on the first 6% is a match rate of 50% and the same cap. If you defer less than the cap, the match applies only to what you actually deferred.',
      'A fixed employer percent is different. The employer deposits that share of salary even when the employee contributes nothing. Vesting is a flat percent you enter. Only the vested share is added to the balance. Unvested employer money is still listed, and it still counts toward an annual-additions cap if you entered one. This is not a year-by-year vesting schedule.',
    ],
    formula: 'Employer = min(employee deferral, salary × cap) × match rate',
    formulaNote: 'On a 60,000 salary, a 6% deferral is 3,600. A 50% match on the first 6% is 1,800. A 10% deferral is still matched only up to 6% of salary, so the employer deposit stays 1,800.',
  },
  {
    id: 'traditional-vs-roth',
    title: 'Traditional vs Roth 403(b)',
    paragraphs: [
      'A traditional 403(b) deferral is generally pre-tax. The contribution lowers taxable income today, and withdrawals in retirement are typically taxed as ordinary income. A Roth 403(b) deferral is after-tax. Qualified withdrawals of contributions and earnings can be tax-free if the tax rules are met.',
      'This projection does not compute either tax. Choosing Traditional or Roth only labels the result. The same salary, deferral, match, return, and fee produce the same account balance here. The spending power of that balance can still differ once taxes are applied, and that step is outside this calculator.',
      'Employer deposits are not the same tax animal as a Roth deferral. Plans have their own rules for how employer money is tracked. Read the plan before treating the whole balance as Roth.',
    ],
  },
  {
    id: 'growth-and-compounding',
    title: 'Growth and compounding',
    paragraphs: [
      'The default convention is nominal. The period rate is the annual return divided by the number of periods. Monthly compounding of a 6% nominal return uses 6% ÷ 12 each month. It does not use the rate that compounds to exactly 6% over the year.',
      'Effective annual compounding is a separate choice. The period rate is (1 + annual return) raised to 1/periods, minus 1. One run uses one convention for both the return and the fee. The two conventions are never mixed in the same projection.',
      'Growth and fees are both simple multiples of the balance invested during that period. They do not compound on each other inside the period. The reported growth is before fees. The fee line is separate. Starting balance + employee deposits + vested employer deposits + growth − fees equals the ending nominal balance, to the cent.',
      'Inflation does not change that nominal balance. The inflation-adjusted figure divides the nominal balance by (1 + inflation) raised to the number of years, so you can see an estimate of today’s purchasing power. Label the two numbers separately. Neither one is a promised return.',
    ],
    formula: 'Nominal period rate = annual rate ÷ periods',
    formulaNote: 'Effective period rate = (1 + annual rate) ^ (1 ÷ periods) − 1. Fees use the same convention as the return.',
  },
  {
    id: 'limits-and-catch-up',
    title: 'Limits and catch-up',
    paragraphs: [
      'U.S. law caps how much can go into a 403(b) in a year, and those dollar caps are updated. This calculator does not store them and does not assume a published number will still be right next year. Limits are off until you turn them on and type the figures for the tax year you want to model.',
      'The employee deferral limit caps elective deferrals. A catch-up amount, if you enter one, is added to that employee cap in any projection year where age at the start of the year is at least the catch-up age you entered. The annual-additions limit, if you enter one, caps employee plus employer dollars. Employee deferrals keep their room first. Employer money is reduced before the employee deferral is cut further.',
      'Some 403(b) plans also offer a special catch-up for long-service employees, often described as a 15-year rule. It depends on the employer and on years of service. This calculator does not decide whether you qualify. If it applies, include that extra room in the catch-up amount you type. Age-50 catch-up and the special 403(b) catch-up are different rules. Do not treat the age field as a determination that you are eligible.',
    ],
  },
  {
    id: 'estimating-savings',
    title: 'How to estimate savings',
    paragraphs: [
      'Final balance mode projects the account forward from the current balance, salary, deferral, employer formula, return, and fees. Contribution-needed mode searches for the lowest employee percent, or the lowest fixed annual amount, that reaches a nominal target. If even the top of the allowed range misses the target, the result says so and shows the ceiling instead of a fake contribution.',
      'Salary-or-match mode solves one unknown at a time. Salary needed requires the deferral or the employer deposit to depend on salary. A fixed dollar deferral with no employer deposit does not change when salary changes, so that request is rejected. Employer-contribution needed solves either the match rate, with the cap held constant, or a flat percent of salary.',
      'Use a return you are willing to live with if markets do worse, and include fees. A higher return makes every mode look easier. The yearly table is there so you can see whether the balance depends on contributions or on the growth assumption.',
    ],
  },
  {
    id: '403b-vs-401k',
    title: '403(b) vs 401(k)',
    paragraphs: [
      'A 401(k) is the retirement plan more often offered by private, for-profit employers. A 403(b) is aimed at public schools and tax-exempt employers. Both can take employee deferrals, both can include an employer contribution, and both can offer traditional and Roth money. The investment lineup, the match, and the catch-up rules are not identical.',
      'The special long-service catch-up is a 403(b) feature, not a standard 401(k) feature. Contribution limits for a given year are published separately for elective deferrals and for overall annual additions, and a person who has both types of plans may have a combined limit. This page models one 403(b) account from the numbers you type. It does not combine a 403(b) with a 401(k), an IRA, or a pension.',
    ],
  },
  {
    id: 'common-mistakes',
    title: 'Common planning mistakes',
    paragraphs: [
      'Treating the projected balance as a promise. The return is an input, and a long horizon multiplies a small change in that input. Read the nominal balance and the inflation-adjusted balance as two different sentences.',
      'Forgetting fees, or assuming every employer matches. A 0.2% fee is not the same result as a 0% fee over 30 years, and a plan with no match should be run with the match set to none.',
      'Mixing up the employee deferral cap and the annual-additions cap, or pasting a limit from an old year into a projection that runs for decades. Limits here stay at the dollars you entered. They do not step up automatically in later years.',
      'Solving two unknowns at once. If both the salary and the match are unknown, the same target has many answers. Pick one unknown, keep the other inputs fixed, and run the scenario again if you want a second case.',
    ],
  },
];

export const FOUR_ZERO_THREE_B_FAQS: readonly FAQItem[] = [
  {
    question: 'Is a 403(b) projection a guaranteed retirement balance?',
    answer:
      'No. The balance is the result of the salary, contributions, return, fees, and limits you entered. Markets, plan rules, and future tax limits can all differ from those assumptions.',
  },
  {
    question: 'Does every 403(b) include an employer match?',
    answer:
      'No. Some employers deposit nothing. Some match a percent of what you defer, up to a cap. Some deposit a fixed percent of salary whether or not you defer. Use the formula in your plan document, or choose no employer match.',
  },
  {
    question: 'Why did the calculator not fill in this year’s IRS limits?',
    answer:
      'Elective-deferral limits, annual-additions limits, and catch-up amounts change, and the special 403(b) catch-up depends on the employer and on service. Enter the figures for the tax year you are modeling. Leaving the limit switch off means no cap is applied.',
  },
  {
    question: 'Does choosing Roth change the projected balance?',
    answer:
      'Not in this calculator. Traditional and Roth change how contributions and withdrawals are taxed. The math here is the account balance before that tax calculation.',
  },
  {
    question: 'What compounding method is the default?',
    answer:
      'Nominal. The period rate is the annual rate divided by the number of contribution periods. Choose effective annual compounding if you want the period rate that compounds to the annual return. Fees follow the same choice.',
  },
  {
    question: 'What if the target balance cannot be reached?',
    answer:
      'Contribution-needed and salary-or-match modes search up to a stated ceiling, including any deferral cap you entered. If the ceiling still misses the target, the screen says the target is out of reach and shows the balance at that ceiling.',
  },
];
