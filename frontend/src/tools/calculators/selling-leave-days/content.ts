import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SELLING_LEAVE_DAYS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-leave-encashment', label: 'What Is Selling Leave Days?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'leave-payout-formulas', label: 'Leave Payout Formulas' },
  { id: 'working-day-assumptions', label: 'Working-Day Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'selling-leave-days-faq', label: 'Frequently Asked Questions' },
];

export const SELLING_LEAVE_DAYS_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a legal leave-encashment entitlement?',
    answer:
      'No. This is a working-day cash estimate (260 working days/year). Employer policies and local labor law may use different divisors or restrictions. It does not deduct tax.',
  },
  {
    question: 'How is daily pay calculated from monthly salary?',
    answer:
      'Annualize monthly pay (×12), then divide by 260 working days. Weekly uses ÷5; hourly uses ×8 hours/day; annual uses ÷260.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Base pay and payout have independent currencies. Math runs in the base-pay currency; the result converts for display. Leave days never FX-convert.',
  },
];
