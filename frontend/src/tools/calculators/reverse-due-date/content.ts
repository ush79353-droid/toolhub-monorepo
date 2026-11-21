import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REVERSE_DUE_DATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Reverse Due Date Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Dating Formula' },
  { id: 'intercourse', label: 'Intercourse Window' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'reverse-due-date-faq', label: 'Frequently Asked Questions' },
];

export const REVERSE_DUE_DATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'From a due date (or conception / earliest intercourse date) and pregnancy length, it estimates the other dates using educational ACOG-style calendar math.',
  },
  {
    question: 'Why subtract length − 14 days for conception?',
    answer:
      'Standard obstetric dating counts ~280 days from the last menstrual period for a 40-week pregnancy, while fertilization is typically about 14 days later. Conception ≈ EDD − (gestation days − 14).',
  },
  {
    question: 'What does the intercourse date mean?',
    answer:
      'It is shown as the start of an approximate fertile window (conception minus 7 days). It is not the same as confirmed fertilization.',
  },
  {
    question: 'Can I edit any of the dates?',
    answer:
      'Yes. The field you last change is authoritative; the other dates update from it and the pregnancy length.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational calendar tool. Clinical dating often uses ultrasound. Confirm with a clinician.',
  },
];
