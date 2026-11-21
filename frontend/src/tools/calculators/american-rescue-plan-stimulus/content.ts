import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARP_STIMULUS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'verified-payment-rules', label: 'Verified Payment Rules' },
  { id: 'phaseout-and-dependents', label: 'Phase-Out & Dependents' },
  { id: 'important-limitations', label: 'Important Limitations' },
  { id: 'eip3-faq', label: 'Frequently Asked Questions' },
];

export const ARP_STIMULUS_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I still receive a third stimulus check from the American Rescue Plan?',
    answer:
      'No. The third Economic Impact Payment (EIP3) was a one-time advance of the 2021 Recovery Rebate Credit under the American Rescue Plan Act of 2021 (P.L. 117-2 / I.R.C. §6428B). Delivery closed in 2021. Any amount shown here is a historical estimate only and is not a currently available government payment.',
  },
  {
    question: 'How much was the third stimulus check?',
    answer:
      'Under I.R.C. §6428B, the maximum was $1,400 per eligible individual ($2,800 for most married couples filing jointly) plus $1,400 for each qualifying dependent under IRC §152, including qualifying adult dependents. Higher AGI reduced the payment linearly to zero across a short phase-out range.',
  },
  {
    question: 'What income levels reduced the payment?',
    answer:
      'Full payment applied at or below $75,000 AGI for single filers, $112,500 for heads of household, and $150,000 for joint filers / surviving spouses. The payment reached $0 at $80,000, $120,000, and $160,000 respectively, with a proportional (linear) reduction in between.',
  },
  {
    question: 'Do adult dependents count?',
    answer:
      'Yes for EIP3. Unlike the first and second Economic Impact Payments, the American Rescue Plan added $1,400 for each qualifying dependent within the meaning of IRC §152 (including many qualifying adult dependents) not only children under 17.',
  },
  {
    question: 'Why does the calculator ask about 2019 or 2020 taxes?',
    answer:
      'Advance EIP3 amounts generally used 2020 return information when available, otherwise 2019. Entering that historical AGI reconstructs the advance formula; it is not a current eligibility determination. SSI, SSDI, Railroad Retirement, and certain VA beneficiaries could receive automatic payments without filing; those paths are not modeled when you select “No.”',
  },
];
