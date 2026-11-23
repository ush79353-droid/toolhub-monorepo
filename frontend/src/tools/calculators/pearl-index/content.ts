import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PEARL_INDEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pearl Index Calculator' },
  { id: 'formula', label: 'How the Pearl Index Is Calculated' },
  { id: 'assumption', label: 'Equal Follow-Up Assumption' },
  { id: 'compare', label: 'Comparison Figures' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'pi-faq', label: 'Frequently Asked Questions' },
];

export const PEARL_INDEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the Pearl Index measure?',
    answer:
      'It is a contraceptive failure rate: pregnancies per 100 woman-years of exposure. Lower values indicate fewer pregnancies per unit exposure time. It is a rate, not an individual’s chance of pregnancy.',
  },
  {
    question: 'What follow-up assumption is used?',
    answer:
      'This calculator uses equal full follow-up: every participant contributes the full study duration. Woman-years = women × months / 12. Studies with staggered dropout need person-time or life-table methods instead.',
  },
  {
    question: 'Why are comparison method numbers shown?',
    answer:
      'They are illustrative figures from the reference UI for orientation. Published perfect-use and typical-use tables (for example Trussell/CDC summaries) differ by population and definition—do not treat the list as personal advice.',
  },
  {
    question: 'Are my study numbers stored?',
    answer:
      'No. Inputs stay in the browser. Share and copy use the public page URL only.',
  },
];
