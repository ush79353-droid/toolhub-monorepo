import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STATE_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-state-tax-navigator', label: 'What Is the State Tax Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Tool' },
  { id: 'available-states', label: 'Available State Calculators' },
  { id: 'state-tax-faq', label: 'Frequently Asked Questions' },
];

export const STATE_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator compute my state income tax?',
    answer:
      'No. It is a navigator that links to dedicated state tax calculators when they exist on Omega Calculators. Select your state and follow the link if available.',
  },
  {
    question: 'Which states have dedicated calculators?',
    answer:
      'Currently Alabama, California, and Illinois have verified live state tax calculators. Other states show an unavailable message until a dedicated tool is published.',
  },
  {
    question: 'Why is there no tax form here?',
    answer:
      'The screenshot defines a state selector and destination link only — no income fields, brackets, or FX. Tax math lives in each state’s dedicated calculator.',
  },
];
