import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HHI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hhi', label: 'What Is HHI?' },
  { id: 'hhi-formula', label: 'Formula' },
  { id: 'hhi-example', label: 'Example' },
  { id: 'hhi-faq', label: 'Frequently Asked Questions' },
];

export const HHI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Herfindahl-Hirschman Index?',
    answer:
      'HHI measures market concentration by summing the squares of each firm’s market share (as a percentage). Higher values mean a more concentrated market.',
  },
  {
    question: 'Do shares need to add up to 100%?',
    answer:
      'No. The calculator uses the firms you enter. If they sum to less than 100%, the HHI covers only those listed firms, and a note shows the share total.',
  },
  {
    question: 'Can a firm have 0% share?',
    answer:
      'Yes. Zero is allowed. Negative shares and a combined total above 100% are rejected.',
  },
  {
    question: 'How many firms can I enter?',
    answer:
      'Up to 15. The form starts with three blank firm rows; add more only when needed.',
  },
];
