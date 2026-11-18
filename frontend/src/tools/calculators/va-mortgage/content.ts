import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VA_MORTGAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-va-mortgage', label: 'What Is a VA Mortgage?' },
  { id: 'va-funding-fee', label: 'VA Funding Fee' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'va-mortgage-faq', label: 'Frequently Asked Questions' },
];

export const VA_MORTGAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the VA funding fee determined?',
    answer:
      'For purchase loans, the published VA table (effective April 7, 2023) uses first vs subsequent use and down-payment band: under 5%, 5%+, or 10%+. Active/Veteran and Reservist/National Guard share that table. Service-connected disability (10+%) and surviving-spouse eligibility are treated as exempt (0%).',
  },
  {
    question: 'What happens if the funding fee is financed?',
    answer:
      'When financed, the fee is added to the base loan (home price − down payment) before amortization. When paid upfront, the mortgage principal stays at the base loan and the fee is shown separately.',
  },
  {
    question: 'Does this calculator convert currencies?',
    answer:
      'No. The reference uses fixed US dollars with a $ symbol only. There are no currency selectors and no FX conversion on this tool.',
  },
];
