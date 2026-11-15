import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FIVE_TWENTY_NINE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-529', label: 'What is a 529 college savings plan?' },
  { id: 'how-a-529-works', label: 'How does a 529 plan work?' },
  { id: 'types-of-529-plans', label: 'Types of 529 plans' },
  { id: 'how-savings-grow', label: 'How 529 savings grow' },
  { id: 'education-inflation', label: 'Education inflation and future tuition' },
  { id: 'monthly-contributions', label: 'How to calculate monthly contributions' },
  { id: 'qualified-expenses', label: 'Qualified education expenses' },
  { id: 'tax-considerations', label: 'Federal and state tax considerations' },
  { id: 'advantages-limitations', label: 'Advantages and limitations' },
  { id: 'how-to-use', label: 'How to use the 529 Calculator' },
  { id: 'worked-example', label: 'Worked example' },
  { id: 'ftn-faq', label: 'Frequently asked questions' },
];

export interface FiveTwentyNineGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
}

export const FIVE_TWENTY_NINE_GUIDE_SECTIONS: readonly FiveTwentyNineGuideSection[] = [
  {
    id: 'what-is-a-529',
    title: 'What is a 529 college savings plan?',
    paragraphs: [
      'A 529 plan is a US education savings arrangement sponsored by a state or by an eligible educational institution. Money you contribute is invested, and qualified withdrawals are generally free of federal income tax when the plan’s rules and the tax rules for that year are met.',
      'The account is usually owned by a parent, grandparent, or other adult. The student is the beneficiary. The owner can change the beneficiary to another eligible family member if the original student does not use the money.',
      'This page is an educational projection. It is not a recommendation to open a particular plan, and it is not personalized tax or investment advice.',
    ],
  },
  {
    id: 'how-a-529-works',
    title: 'How does a 529 plan work?',
    paragraphs: [
      'You put money in, the plan invests it according to the option you choose, and you withdraw it later for education. Contributions themselves are not deducted on the federal return. The tax benefit is mainly that investment earnings can come out untaxed when the withdrawal is qualified.',
      'Most savings plans accept contributions from anyone, not only the account owner. Many plans can be used at eligible schools in any state. A state’s own tax break, if it has one, may still require that you use that state’s plan.',
      'The calculator follows the cash, not the tax form. It projects contributions, growth, fees, scholarships, and withdrawals. It does not file a return or apply a state’s deduction.',
    ],
  },
  {
    id: 'types-of-529-plans',
    title: 'Types of 529 plans',
    paragraphs: [
      'An education savings plan invests your contributions. The future balance depends on what the investments do. You can generally use the money at eligible colleges, universities, vocational schools, and, within statutory limits that change, for some other education costs.',
      'A prepaid tuition plan lets you buy tuition credits or years of tuition in advance, usually tied to a particular state’s public colleges. It hedges tuition inflation more directly, and it is less flexible if the student goes somewhere else.',
      'Savings plans are sold directly by the state or through an advisor. Advisor-sold plans can carry different fees. This calculator models one invested balance with a return and a fee you enter. It does not price a prepaid contract.',
    ],
  },
  {
    id: 'how-savings-grow',
    title: 'How 529 savings grow',
    paragraphs: [
      'Each month the balance changes by the deposit, the assumed return, and the fee. The monthly return is the annual return percent divided by 12. The monthly fee is the annual fee percent divided by 12. Those are nominal rates, not the effective rate (1 + annual rate) to the power of 1/12 minus 1.',
      'A beginning-of-month deposit earns that month’s return. An end-of-month deposit does not. Growth and fees are tracked separately, then the fee is subtracted. The balance is not allowed to go below zero.',
      'An extra annual contribution is added at the start of each savings year, including today. It stops when college starts. Monthly deposits also stop when college starts. During college, the remaining balance keeps earning the same monthly return and paying the same fee.',
    ],
    formula: 'month change = deposit + balance × (return% / 12) − balance × (fee% / 12)',
    formulaNote: 'Return and fee are both divided by 12. They are not mixed with an effective monthly rate.',
  },
  {
    id: 'education-inflation',
    title: 'Education inflation and future tuition costs',
    paragraphs: [
      'College prices have often risen faster than general consumer prices, but the next decade is not a fact you can look up today. Enter the annual cost you want to plan around, and an inflation rate you are willing to assume.',
      'The first college year is today’s annual cost grown for every year until college starts. Each later college year grows one more year from that first future year. A four-year plan is the sum of those four inflated years, not four times the first year, unless inflation is zero.',
      'The default of 20,000 is a round illustration so the form is not empty. It is not a national tuition average, and it is not a quote from a school.',
    ],
    formula: 'future year cost = today’s annual cost × (1 + inflation) ^ (years until college + year index)',
  },
  {
    id: 'monthly-contributions',
    title: 'How to calculate monthly contributions',
    paragraphs: [
      'The forward projection uses the monthly amount you type. The reverse calculation asks a different question: what base monthly deposit, before any contribution growth, would make withdrawals cover the target share of costs after scholarships?',
      'That amount is found by bisection. Fees, contribution increases, extra annual deposits, and growth during college make a simple savings formula the wrong closed form. The search stops at a very large monthly deposit. If that deposit still misses the target, or if college starts immediately and the balance is already short, the calculator says the target cannot be reached by raising the monthly deposit.',
      'A target of zero, or a plan that already covers the target with no new monthly deposit, reports a required contribution of zero.',
    ],
  },
  {
    id: 'qualified-expenses',
    title: 'Qualified education expenses',
    paragraphs: [
      'Qualified higher-education expenses generally include tuition, required fees, books, supplies, and equipment. Room and board can qualify for a student who is enrolled at least half time, up to the school’s allowance. Computers and internet access can qualify when they are used primarily by the beneficiary during enrollment.',
      'Statute also allows some 529 money for K-12 tuition, apprenticeship costs, and student-loan repayment, and a limited rollover to a Roth IRA. Those uses have dollar caps and other conditions that Congress can change. This calculator does not store those caps and does not decide whether a withdrawal is qualified.',
      'A scholarship reduces the bill in this model. It is today’s annual scholarship, inflated with the same education rate, and it cannot exceed that year’s cost. It is subtracted once. It is not also treated as a withdrawal from the plan.',
    ],
  },
  {
    id: 'tax-considerations',
    title: 'Federal and state tax considerations',
    paragraphs: [
      'Qualified withdrawals are generally free of federal income tax when the requirements for that year are met. A nonqualified withdrawal can make the earnings portion taxable, and an additional tax can apply to those earnings. Exceptions exist, including some scholarship withdrawals, and the death or disability of the beneficiary. Check the current IRS instructions before you rely on an exception.',
      'States differ. Some offer a deduction or credit for contributions, sometimes only for the state’s own plan. Some tax a nonqualified withdrawal or recapture a prior deduction. Living in one state and using another state’s plan can change the state result even when the federal result is the same.',
      'Gift-tax treatment also depends on the tax year. There is an annual exclusion, and 529 contributions have a special election that spreads a larger gift over five years. Those dollar amounts change. This calculator does not apply them. The optional contribution alert is only a reminder you type. Showing amounts in another currency does not change the plan’s US tax treatment.',
    ],
  },
  {
    id: 'advantages-limitations',
    title: 'Advantages and limitations of 529 plans',
    paragraphs: [
      'The main advantages are tax-free growth for qualified withdrawals, high contribution flexibility compared with some other education accounts, and the ability to change the beneficiary. Many plans have low minimums and age-based investment options.',
      'The limits are real. Investment returns are not guaranteed and the balance can fall. Fees reduce what you keep. Nonqualified withdrawals can create tax. A large 529 balance can affect financial-aid formulas, and the details depend on who owns the account. Prepaid plans can be a poor fit if the student leaves the participating system. State tax benefits can be clawed back.',
      'The projection stops at the last college year you enter. It does not model financial aid, loans, taxes on a nonqualified withdrawal, or a change of beneficiary.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to use the 529 Calculator',
    paragraphs: [
      'Enter the student’s age, the age college starts, and how many years of school you want to fund. Enter today’s annual education cost and the inflation rate you want to assume. A scholarship, if you enter one, is an annual amount in today’s currency.',
      'Then enter the current balance, any lump sum you will add today, the monthly deposit, the return, and the fee. Advanced options cover contribution increases, an extra once-a-year deposit, the share of net college cost you want to cover, when the college bill is paid, and an optional reminder if one year’s deposits get large.',
      'Results update as you edit. Read the balance at college start separately from the amount the plan actually withdraws during college. The yearly table shows contributions, growth, fees, costs, scholarships, withdrawals, and the ending balance.',
    ],
  },
  {
    id: 'worked-example',
    title: 'Worked example',
    paragraphs: [
      'The default form is a child who is 8, starting college at 18, for 4 years. Today’s annual cost is 20,000 with 5% education inflation. The account has 10,000, the monthly deposit is 250 at the end of the month, the assumed return is 6% a year, and the fee is 0.2% a year. There is no scholarship, no lump sum, and no contribution growth. College bills are paid at the start of each school year. The target is 100% of cost after scholarships. Amounts are in the symbol you select, starting at USD.',
      'Under those assumptions the balance at college start is 58,363.63. The first college year costs 32,577.89. Four inflated years cost 140,414.79. Deposits over 120 months are 30,000. Estimated growth is 20,585.80 and estimated fees are 686.19. Withdrawals cover 59,899.60, which is 42.66% of the education cost, and the funding gap is 80,515.19. The monthly deposit that would cover the full net cost is 682.99. These figures are the engine’s output for that exact input, not a promise of future returns.',
    ],
  },
];

export const FIVE_TWENTY_NINE_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator use a live tuition average?',
    answer:
      'No. Every education cost is an amount you enter. The default of 20,000 is there so the example has a number. Replace it with the school cost you want to plan around.',
  },
  {
    question: 'Why is the balance at college start different from the amount the plan pays?',
    answer:
      'The opening college balance is a snapshot. During college the leftover money can still grow, fees still apply, and each year’s bill is withdrawn separately. The amount paid is the sum of those withdrawals, which can be higher or lower than the balance on the first day of college.',
  },
  {
    question: 'Are qualified 529 withdrawals tax-free?',
    answer:
      'Qualified withdrawals are generally free of federal income tax when the rules for that tax year are met. State treatment varies. A nonqualified withdrawal can make earnings taxable. This page does not decide whether your withdrawal qualifies.',
  },
  {
    question: 'Does the calculator apply the IRS gift-tax exclusion?',
    answer:
      'No. Annual exclusion amounts and the five-year 529 gift election change with the tax year. The optional alert is a reminder you type. It is not an IRS limit.',
  },
  {
    question: 'What if college starts this year?',
    answer:
      'There is no saving period left, so raising the monthly deposit cannot close a shortfall. The calculator reports that the required monthly contribution cannot be solved, unless the current balance and lump sum already cover the target.',
  },
  {
    question: 'Does switching the currency convert my 529 balance?',
    answer:
      'No. The selector changes the symbol only. A 529 plan is still a US tax arrangement. Displaying the same numbers with another symbol does not convert them and does not change that tax treatment.',
  },
];
