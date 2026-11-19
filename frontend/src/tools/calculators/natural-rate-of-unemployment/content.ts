import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NATURAL_UNEMPLOYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-natural-rate', label: 'What Is the Natural Rate?' },
  { id: 'natural-rate-formula', label: 'Formula' },
  { id: 'population-units', label: 'Population Units' },
  { id: 'natural-rate-faq', label: 'Frequently Asked Questions' },
];

export const NATURAL_UNEMPLOYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator include?',
    answer:
      'It uses a simplified natural-rate model: frictional plus structural unemployment divided by the total labor force. Cyclical unemployment and other categories are not included.',
  },
  {
    question: 'How do population units work?',
    answer:
      'Each input has its own people / thousand / million selector. Amounts are converted to a count of people before the formula runs. Changing a unit preserves the underlying population count. The unemployment rate percentage is never unit-converted.',
  },
  {
    question: 'Can frictional + structural exceed the labor force?',
    answer:
      'No. The calculator rejects inputs where natural unemployment (frictional + structural) is greater than the total labor force.',
  },
  {
    question: 'What if unemployment is zero?',
    answer:
      'A labor force greater than zero with zero frictional and structural unemployment yields a valid 0% natural rate.',
  },
];
