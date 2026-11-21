import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Healthy Weight During Pregnancy' },
  { id: 'what-it-shows', label: 'What This Tool Shows' },
  { id: 'iom', label: 'IOM Gain Ranges' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'not-weight-loss', label: 'Not a Weight-Loss Plan' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

export const FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator tell me how to lose weight in pregnancy?',
    answer:
      'No. It shows educational Institute of Medicine gestational weight-gain ranges. Intentional weight-loss diets in pregnancy are not generated here and should only be considered under clinician care.',
  },
  {
    question: 'Where do the ranges come from?',
    answer:
      'Total recommended gain bands follow IOM 2009 recommendations as summarized in CDC maternal and infant health materials, by pre-pregnancy BMI and singleton vs twin pregnancy.',
  },
  {
    question: 'How does pregnancy week affect the numbers?',
    answer:
      'Cumulative recommended gain is scaled by week ÷ 40 (capped at term). This is a simple educational schedule—not an individualized clinical curve.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Entries stay in your browser for this session. Share uses only the public page URL.',
  },
];
