import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BENZODIAZEPINE_CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Benzodiazepine Conversion' },
  { id: 'equivalents', label: 'Duration Groups' },
  { id: 'bz-faq', label: 'Frequently Asked Questions' },
];

export const BENZODIAZEPINE_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'Are IV and PO midazolam treated separately?',
    answer:
      'Yes. Midazolam IV and Midazolam PO use different equivalency anchors because bioavailability differs.',
  },
  {
    question: 'Can I use this to switch benzodiazepines?',
    answer:
      'No. Equivalencies are approximate teaching values—not individualized taper or switching schedules.',
  },
];