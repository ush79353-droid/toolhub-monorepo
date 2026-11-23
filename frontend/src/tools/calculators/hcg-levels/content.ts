import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HCG_LEVELS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'hCG Levels Calculator' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formula', label: 'Formulas' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hcg-faq', label: 'Frequently Asked Questions' },
];

export const HCG_LEVELS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is doubling time calculated?',
    answer:
      'For a rising pair (B > A > 0) over t days: doubling time = t × ln(2) / ln(B/A). Falling or unchanged values do not show a positive doubling time.',
  },
  {
    question: 'What are one-day and two-day increases?',
    answer:
      'They standardize the observed ratio to a 1-day or 2-day interval: 100 × ((B/A)^(d/t) − 1) with d = 1 or 2.',
  },
  {
    question: 'Does this tell me if my pregnancy is healthy?',
    answer:
      'No. It only reports descriptive serial arithmetic. Clinical interpretation belongs with a clinician and the lab’s reference ranges.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser. Share/copy use the public page URL only.',
  },
];
