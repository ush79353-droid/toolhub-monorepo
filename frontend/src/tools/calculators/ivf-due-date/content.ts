import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IVF_DUE_DATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'IVF Due Date Calculator' },
  { id: 'acog-formula', label: 'ACOG IVF Dating Formulas' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'plurality', label: 'Twins and Triplets' },
  { id: 'planning', label: 'Planning vs Pregnant' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ivf-due-date-faq', label: 'Frequently Asked Questions' },
];

export const IVF_DUE_DATE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is an IVF due date estimated?',
    answer:
      'ACOG Committee Opinion 700 uses calendar dating from the known IVF event. Day-3 embryo transfer adds 263 days; Day-5 transfer adds 261 days. When retrieval or fertilization is the known event (own-egg or donor-egg cycle), add 266 days.',
  },
  {
    question: 'Do twins or triplets change the due date here?',
    answer:
      'No. This educational tool keeps the same 40-week calendar EDD. Timing of delivery for multiples is a clinical decision and is not estimated here.',
  },
  {
    question: 'What date should I enter for own eggs or donor eggs?',
    answer:
      'Enter the egg retrieval or fertilization date. ACOG adds 266 days from that event. For Day-3 or Day-5 modes, enter the embryo transfer date instead.',
  },
  {
    question: 'Worked example: Day-3 transfer on 2026-01-01?',
    answer:
      'EDD = 2026-01-01 + 263 days = 2026-09-21. Day-5 on the same date adds 261 days → 2026-09-19. Own/donor retrieval on that date adds 266 days → 2026-09-24.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Dates and results stay in your browser for this session. Share uses only the public page URL—not your transfer date.',
  },
  {
    question: 'Is currency conversion involved?',
    answer: 'No. This calculator uses calendar dates only.',
  },
];
