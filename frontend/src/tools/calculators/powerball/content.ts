import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const POWERBALL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'pb-lump-vs-annuity', label: 'Powerball lump sum vs. annuity' },
  { id: 'pb-lump-sum', label: 'How does the Powerball lump sum work?' },
  { id: 'pb-annuity', label: 'How does the Powerball annuity payout work?' },
  { id: 'pb-after-taxes', label: 'Powerball after taxes' },
  { id: 'pb-how-to-use', label: 'How to use the Powerball payout calculator?' },
  { id: 'pb-disclaimer', label: 'Powerball calculator disclaimer' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'pb-faq', label: 'Frequently asked questions' },
];

export const POWERBALL_FAQS: readonly FAQItem[] = [
  {
    question: 'How many years is the Powerball annuity payout?',
    answer:
      'The Powerball annuity generally consists of 30 graduated payments over about 29 years, with payments typically increasing about 5% each year.',
  },
  {
    question: 'What is the federal tax on Powerball winnings?',
    answer:
      'Large lottery prizes are usually subject to federal income tax withholding (commonly 24% on reportable winnings) and progressive federal income tax on the rest of your return. Withholding is not necessarily your final tax liability.',
  },
  {
    question: 'Do I need to pay state taxes if I win Powerball?',
    answer:
      'It depends on the jurisdiction. Some states have no individual income tax; California generally exempts state lottery winnings from CA personal income tax; other states tax lottery winnings as ordinary income. Local taxes may also apply.',
  },
  {
    question: 'How much do I get if I win the Powerball?',
    answer:
      'Your take-home depends on the advertised jackpot, cash vs annuity choice, federal taxes, state taxes, and filing status. This calculator estimates those scenarios; official lottery cash values control the actual cash option.',
  },
  {
    question: 'How do I calculate Powerball annuity?',
    answer:
      'Find the first payment so 30 graduated payments at 5% sum to the advertised jackpot, then Pₙ = P₁ × (1.05)ⁿ⁻¹ for each year.',
  },
  {
    question: 'Is the lump-sum option better than the annuity?',
    answer:
      'It depends on liquidity needs, investment plans, tax timing, inflation, and personal discipline. Neither option is universally better; compare estimated nets and present-value considerations with a professional.',
  },
  {
    question: 'Does Powerball pay winners immediately?',
    answer:
      'Payment timing follows official lottery claim procedures after validation. Winners generally choose cash or annuity during the claim process; funds are not instant at ticket purchase.',
  },
  {
    question: 'Are Powerball winnings taxable?',
    answer:
      'Yes for federal income tax purposes in the United States. State and local treatment varies by jurisdiction.',
  },
  {
    question: 'Can I choose between lump sum and annuity?',
    answer:
      'Yes, jackpot winners typically choose cash (lump sum) or the annuity when claiming, subject to lottery rules and deadlines.',
  },
  {
    question: 'What happens to Powerball annuity payments after death?',
    answer:
      'Beneficiary and estate treatment depends on lottery rules, claim paperwork, and applicable law. Consult legal and tax professionals for estate planning.',
  },
];
