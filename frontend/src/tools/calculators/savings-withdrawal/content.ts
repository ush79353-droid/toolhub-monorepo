import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAVINGS_WITHDRAWAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-savings-withdrawal', label: 'What Is a Savings Withdrawal Plan?' },
  { id: 'savings-withdrawal-method', label: 'How Long Will Money Last?' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'savings-withdrawal-faq', label: 'Frequently Asked Questions' },
];

export const SAVINGS_WITHDRAWAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this calculator estimate how long savings last?',
    answer:
      'Each month the balance first earns interest at the nominal annual rate divided by 12, then a withdrawal is taken. Periods continue until the balance is exhausted (including a possible partial final withdrawal). Duration is reported as whole years and months from the first withdrawal date, and the last withdrawal date advances by calendar months.',
  },
  {
    question: 'What if interest covers my withdrawals?',
    answer:
      'When the monthly interest on the current balance is at least as large as the withdrawal, the balance never depletes. The calculator reports that case instead of inventing an endless schedule.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Balance and withdrawal amount each have an independent currency. The withdrawal is converted into the balance currency before the period-by-period simulation. Dates, durations, withdrawal counts, and the interest rate are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'What is in Advanced settings?',
    answer:
      'The Advanced settings disclosure matches the reference layout. No extra fields are unlocked because project specifications do not define verified advanced parameters for this tool. The verified convention is monthly compounding with monthly withdrawals.',
  },
];
