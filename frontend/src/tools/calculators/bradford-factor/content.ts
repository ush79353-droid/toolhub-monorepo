import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BRADFORD_FACTOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bradford-factor', label: 'What Is the Bradford Factor?' },
  { id: 'bradford-formula', label: 'Bradford Factor Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'bradford-examples', label: 'Examples' },
  { id: 'how-to-interpret', label: 'How to Interpret Scores' },
  { id: 'bradford-faq', label: 'Frequently Asked Questions' },
];

export const BRADFORD_FACTOR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Bradford Factor?',
    answer:
      'The Bradford Factor is a workforce metric that weights short, frequent absences more heavily than longer single absences. It multiplies the square of absence spells by total days absent.',
  },
  {
    question: 'What counts as a spell (S)?',
    answer:
      'A spell is one continuous absence episode, regardless of length. Three separate one-day absences are three spells; one three-day absence is one spell.',
  },
  {
    question: 'Can the Bradford Factor be zero?',
    answer:
      'Yes. If spells or days absent are zero, B = 0. That is a valid result for those inputs.',
  },
  {
    question: 'Is a higher Bradford Factor always worse?',
    answer:
      'Organizations often treat higher scores as a signal to review patterns, but thresholds vary by policy. The calculator reports the formula result only; it does not apply disciplinary bands.',
  },
];
