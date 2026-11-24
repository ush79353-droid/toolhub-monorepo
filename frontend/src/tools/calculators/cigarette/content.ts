import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CIGARETTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Is cigarette smoking an addiction?' },
  { id: 'how-it-works', label: 'How does the cigarette calculator work?' },
  { id: 'risks', label: 'What are the risks of smoking?' },
  { id: 'cigarette-faq', label: 'Frequently Asked Questions' },
];

export const CIGARETTE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total cigarettes calculated?',
    answer:
      'Total = cigarettes per day × number of days in the time frame. Packs per day and cigarettes per day stay linked by pack size (cigarettes/day = packs/day × cigarettes in pack).',
  },
  {
    question: 'How are years and months converted to days?',
    answer:
      'Without calendar dates, this tool uses a fixed convention: 1 year = 365 days and 1 month = 365/12 days.',
  },
  {
    question: 'What if I smoke zero cigarettes?',
    answer:
      'A zero daily rate with a valid time frame yields a total of 0 — zero exposure is handled explicitly.',
  },
  {
    question: 'Are my inputs stored?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only.',
  },
];
