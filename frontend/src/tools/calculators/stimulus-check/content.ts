import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STIMULUS_CHECK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'verified-payment-rules', label: 'Verified Payment Rules' },
  { id: 'phaseout-and-kids', label: 'Phase-Out & Kids' },
  { id: 'important-limitations', label: 'Important Limitations' },
  { id: 'eip1-faq', label: 'Frequently Asked Questions' },
];

export const STIMULUS_CHECK_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I still receive a first stimulus check today?',
    answer:
      'No. The first Economic Impact Payment (EIP1) was a one-time advance of the 2020 Recovery Rebate Credit under the CARES Act. Delivery closed years ago. Any amount shown here is a historical estimate only and is not a currently available 2026 benefit.',
  },
  {
    question: 'How much was the first stimulus check?',
    answer:
      'Under I.R.C. §6428, the maximum was $1,200 per eligible individual ($2,400 for most married couples filing jointly) plus $500 for each qualifying child under age 17. Higher AGI reduced the payment by 5% of the amount over the applicable threshold.',
  },
  {
    question: 'What income levels reduced the payment?',
    answer:
      'The payment began phasing out above $75,000 AGI for single filers, $112,500 for heads of household, and $150,000 for joint filers / surviving spouses. The reduction was 5% of AGI above that threshold, floored at $0.',
  },
  {
    question: 'Do adult dependents count as “kids” here?',
    answer:
      'No. EIP1’s extra $500 applied only to qualifying children under 17 within the meaning of IRC §24(c). Older children and adult dependents did not generate an EIP1 add-on.',
  },
  {
    question: 'What if I did not file a 2019 tax return?',
    answer:
      'Most advances used 2019 return information. SSI, SSDI, Railroad Retirement, and certain VA beneficiaries could receive automatic payments without filing. This calculator does not model those benefit-agency paths; selecting “No” for 2019 filing yields $0 with that limitation noted.',
  },
];
