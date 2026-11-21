import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEVO_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'About This Tool' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'fda-label', label: 'FDA Label Context' },
  { id: 'devine', label: 'Devine Ideal Body Weight' },
  { id: 'limits', label: 'When mcg/day Is Gated' },
  { id: 'levo-faq', label: 'Frequently Asked Questions' },
];

export const LEVO_FAQS: readonly FAQItem[] = [
  {
    question: 'When does the mcg per day field show a number?',
    answer:
      'Only for the verified educational teaching branch: age 15–50, FT4 Low, no heart disease, and height eligible for Devine IBW (≥152.4 cm). The figure is 1.6 mcg/kg × the lesser of actual weight and Devine IBW — label/Omni teaching arithmetic, not a personal prescription.',
  },
  {
    question: 'What does the FDA label say about adult starting doses?',
    answer:
      'Current SYNTHROID (levothyroxine sodium) DailyMed labeling states that the full replacement dose in adults with hypothyroidism is about 1.6 mcg/kg/day, with lower starting doses for older adults or those with underlying cardiac disease, followed by titration using serum TSH or free-T4.',
  },
  {
    question: 'Why is Normal FT4 gated?',
    answer:
      'Normal FT4 may correspond to subclinical hypothyroidism teaching context. Treatment decisions need TSH, clinical context, and often more than a single FT4 radio — so this tool does not invent a SCH dose table.',
  },
];
