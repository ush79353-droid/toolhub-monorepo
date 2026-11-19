import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRUMP_ACCOUNTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-trump-account', label: 'What is a Trump Account?' },
  {
    id: 'how-to-use-trump-accounts-calculator',
    label: 'How to use Trump Accounts Calculator',
  },
  {
    id: 'example-calculation',
    label: 'Example calculation: What the numbers really say',
  },
  {
    id: 'trump-vs-529-vs-brokerage',
    label: 'Trump Account vs. 529 plan vs. brokerage account',
  },
  { id: 'trump-accounts-faq', label: 'FAQs' },
];

export const TRUMP_ACCOUNTS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between a Trump Account and a 529 plan?',
    answer:
      'The two account types have different purposes, eligibility requirements, contribution rules, tax treatment, and withdrawal provisions. A 529 plan is generally education-focused; Trump Account rules depend on applicable legislation and official guidance. Compare current official sources before deciding which fits your goals.',
  },
  {
    question: 'Who is eligible for a Trump Account?',
    answer:
      'Eligibility depends on statutory requirements and current official guidance. This calculator does not determine eligibility — verify through official government or IRS sources for your situation.',
  },
  {
    question: 'How much can I contribute to a Trump Account?',
    answer:
      'Contribution limits and permitted contribution types depend on current rules. This tool does not hardcode unverified limits; enter the annual amount you plan to contribute and review official guidance for caps that may apply.',
  },
  {
    question: 'Can parents contribute to a Trump Account?',
    answer:
      'Eligible contributors (often including parents or guardians) are defined by the applicable account rules. Confirm who may contribute and under what conditions using current official materials.',
  },
  {
    question: "How does compound interest affect a child's account?",
    answer:
      'Investment returns can generate additional growth over time. Earnings may themselves earn returns, so balances can grow faster than contributions alone — especially over many years. Actual returns are not guaranteed.',
  },
  {
    question: 'Are Trump Account investment returns guaranteed?',
    answer:
      'No. Scenario rates in this calculator (10%, 6%, 4%) are illustrative assumptions only. Real account values can rise or fall with markets and investment choices.',
  },
  {
    question: 'Can I withdraw money from a Trump Account?',
    answer:
      'Withdrawals are governed by applicable account restrictions and tax rules. Early withdrawals may be restricted or subject to taxes and penalties. Review official guidance before withdrawing.',
  },
];

export const COLLEGE_COST_HREF = '/tools/college-cost-calculator';
export const SAVINGS_GOAL_HREF = '/tools/savings-goal-calculator';
export const COMPOUND_INTEREST_HREF = '/tools/compound-interest-calculator';
