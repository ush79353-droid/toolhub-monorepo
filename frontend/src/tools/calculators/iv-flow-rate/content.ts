import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IV_FLOW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'IV Flow Rate Calculator' },
  { id: 'formula', label: 'IV flow rate formula' },
  { id: 'iv-flow-faq', label: 'Frequently Asked Questions' },
];

export const IV_FLOW_FAQS: readonly FAQItem[] = [
  {
    question: 'How is IV flow rate calculated?',
    answer:
      'Volume flow (mL/min) = volume (mL) ÷ time (min). Drops/min = volume flow × drop factor (gtts/mL). Example: 500 mL over 4 hours at 20 gtts/mL → 125 mL/h and about 41.67 gtts/min.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
