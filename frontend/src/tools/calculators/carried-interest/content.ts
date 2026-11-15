import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CARRIED_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-carried-interest', label: 'What Is Carried Interest?' },
  { id: 'carried-interest-formula', label: 'Carried Interest Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'carried-interest-faq', label: 'Frequently Asked Questions' },
];

export const CARRIED_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'What is carried interest?',
    answer:
      'Carried interest (carry) is the general partner’s performance fee — typically a share of fund profits above a preferred return (hurdle), not a fee on the entire fund value.',
  },
  {
    question: 'How is the hurdle amount calculated?',
    answer:
      'This calculator compounds the hurdle annually: Hurdle Profit = Initial × ((1 + Hurdle Rate / 100)^Years − 1). Carry applies only to profit above that amount when catch-up is off.',
  },
  {
    question: 'What does GP catch-up mean?',
    answer:
      'Without catch-up, the GP earns carry only on profit above the hurdle. With full catch-up, the GP first receives post-hurdle profit until its share equals the carry rate of total profit, then remaining profit splits at the carry rate.',
  },
  {
    question: 'Can fund return be negative?',
    answer:
      'Yes. If the final fund value is below the initial value, fund return is negative and carried interest is zero — losses do not create a GP payout.',
  },
];
