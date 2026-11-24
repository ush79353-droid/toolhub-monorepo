import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ADRENAL_WASHOUT_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'The adrenal washout calculator' },
  { id: 'formula', label: 'Adrenal washout formula' },
  { id: 'adenoma', label: 'Adrenal adenoma' },
  { id: 'example', label: 'Adrenal calculator — a practical example' },
  { id: 'adrenal-washout-faq', label: 'Frequently Asked Questions' },
];

export const ADRENAL_WASHOUT_FAQS: readonly FAQItem[] = [
  {
    question: 'What inputs does adrenal washout need?',
    answer:
      'Three CT density readings in Hounsfield units (HU): pre-contrast (unenhanced), 60–75 second post-contrast (portal venous / enhanced), and 15-minute delayed.',
  },
  {
    question: 'What washout thresholds suggest adenoma?',
    answer:
      'Absolute washout higher than 60%, or relative washout higher than 40%, is strongly suggestive of adrenal adenoma on a dedicated adrenal CT protocol. This is educational decision support, not a diagnosis.',
  },
  {
    question: 'When is absolute washout unavailable?',
    answer:
      'Absolute washout divides by (enhanced − pre-contrast). If that denominator is zero, absolute washout cannot be calculated; relative washout may still be available when enhanced HU is not zero.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL and a text summary of the current result.',
  },
];
