import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is an Early Retirement Calculator?' },
  { id: 'formula', label: 'Formulas and Assumptions' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'withdrawal-rate', label: 'Withdrawal Rate and Required Balance' },
  { id: 'compounding', label: 'Monthly Compounding and Deposit Timing' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'er-faq', label: 'Frequently Asked Questions' },
];

export const ER_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly deposit calculated?',
    answer:
      'Monthly deposit = max(annual net income − annual expenses, 0) ÷ 12. If expenses exceed income, the monthly deposit is treated as zero.',
  },
  {
    question: 'How is the required retirement balance calculated?',
    answer:
      'Required balance = annual expenses ÷ (withdrawal rate ÷ 100). Example: expenses 30,000 with a 4% withdrawal rate → 30,000 ÷ 0.04 = 750,000.',
  },
  {
    question: 'Are deposits at the beginning or end of each month?',
    answer:
      'This calculator uses end-of-month deposits (an ordinary annuity). Interest for the month is applied to the prior balance, then the monthly deposit is added.',
  },
  {
    question: 'What compounding convention is used?',
    answer:
      'The annual return is converted to a monthly rate with (1 + r)^(1/12) − 1, matching effective annual compounding. The tool does not use a simple-interest shortcut.',
  },
  {
    question: 'What if my initial balance already covers the required amount?',
    answer:
      'Duration is zero. Total contribution and total interest for the accumulation phase are zero; you are already at or above the planning target.',
  },
  {
    question: 'When is the goal unreachable?',
    answer:
      'Examples include a zero or negative savings rate with a non-positive return while still short of the target, an invalid withdrawal rate (≤ 0), or a path that would take more than 200 years under the model.',
  },
  {
    question: 'Does changing the currency convert my amounts?',
    answer:
      'No. The currency selector only changes symbols and grouping. Amounts are not converted with exchange rates.',
  },
  {
    question: 'Is this the same as the FIRE calculator?',
    answer:
      'Related but distinct. This tool focuses on derived monthly savings capacity, a withdrawal-rate nest egg, and time-to-target with end-of-month deposits. The FIRE calculator adds ages, inflation scenarios, and alternate FIRE-number methods.',
  },
];
