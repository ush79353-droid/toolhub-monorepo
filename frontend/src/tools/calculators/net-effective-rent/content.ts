import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_EFFECTIVE_RENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-net-effective-rent', label: 'What Is Net Effective Rent?' },
  { id: 'net-effective-rent-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'net-effective-rent-faq', label: 'Frequently Asked Questions' },
];

export const NET_EFFECTIVE_RENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is net effective rent calculated?',
    answer:
      'Lease months = years × 12 + months. Gross lease value = monthly rent × lease months. Subtract rent-free value, tenant cash allowance, and total operating costs over the lease. Divide the remainder by lease months for the monthly net effective rent; multiply by 12 for the annual figure.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Mixed money inputs normalize into the monthly-rent currency before the lease math. Monthly and annual results can display in other currencies using stored MongoDB FX rates. Percent and month counts never convert.',
  },
  {
    question: 'What does operating costs % mean?',
    answer:
      'It is a percent of monthly rent treated as an additional monthly operating cost, then applied across the full lease term along with any fixed operating costs.',
  },
  {
    question: 'Why is area-based calculations disabled?',
    answer:
      'The reference screenshot shows the toggle, but no area fields or per-area formulas were specified. The checkbox is kept for parity and left unavailable.',
  },
];
