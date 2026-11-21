import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEVO_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'About This Tool' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'fda-label', label: 'FDA Label Context' },
  { id: 'limits', label: 'Why mcg/day Is Not Shown' },
  { id: 'levo-faq', label: 'Frequently Asked Questions' },
];

export const LEVO_FAQS: readonly FAQItem[] = [
  {
    question: 'Why is the mcg per day field empty?',
    answer:
      'Individualized levothyroxine dosing requires a confirmed indication, labs (often TSH and/or free T4), cardiovascular assessment, and clinician titration. This screenshot UI alone is not an approved prescribing algorithm, so Omega does not invent a personal dose.',
  },
  {
    question: 'What does the FDA label say about adult starting doses?',
    answer:
      'Current SYNTHROID (levothyroxine sodium) DailyMed labeling states that the full replacement dose in adults with hypothyroidism is about 1.6 mcg/kg/day, with lower starting doses for older adults or those with underlying cardiac disease, followed by titration using serum TSH or free-T4. That is label teaching context — not a prescription from this calculator.',
  },
];
