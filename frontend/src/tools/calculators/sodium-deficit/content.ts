import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SODIUM_DEFICIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Sodium Deficit Calculator' },
  { id: 'what-is', label: 'What is sodium deficit?' },
  { id: 'formula', label: "What's the sodium deficit formula?" },
  { id: 'limits', label: 'Limits of the estimate' },
  { id: 'nad-faq', label: 'Frequently Asked Questions' },
];

export const SODIUM_DEFICIT_FAQS: readonly FAQItem[] = [
  {
    question: "What's the sodium deficit formula?",
    answer:
      'Sodium deficit (mmol) = TBW × (desired sodium − serum sodium), where TBW is weight (kg) × an age/sex fraction. Default desired sodium is 140 mEq/L.',
  },
  {
    question: 'What TBW fractions are used?',
    answer:
      'Child and adult male 0.6; adult female and elderly male 0.5; elderly female 0.45 (Omni teaching set).',
  },
  {
    question: 'Does this tell me how fast to correct hyponatremia?',
    answer:
      'No. It estimates a sodium amount only. Correction rate, fluid choice, and volume status are clinical decisions outside this worksheet.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your labs or weight.',
  },
];
