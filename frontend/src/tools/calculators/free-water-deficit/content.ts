import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FREE_WATER_DEFICIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Free Water Deficit Calculator' },
  { id: 'what-is-fwd', label: 'What is water deficit?' },
  { id: 'formula', label: 'How is free water deficit calculated?' },
  { id: 'limits', label: 'Limits of the estimate' },
  { id: 'fwd-faq', label: 'Frequently Asked Questions' },
];

export const FREE_WATER_DEFICIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate free water deficit?',
    answer:
      'Estimate TBW as weight (kg) × an age/sex fraction, then FWD = TBW × ((measured Na / desired Na) − 1). Default desired sodium is 140 mEq/L.',
  },
  {
    question: 'What TBW fractions does this calculator use?',
    answer:
      'Child and adult male 0.6; adult female and elderly male 0.5; elderly female 0.45 — the Omni / Adrogué–Madias teaching set.',
  },
  {
    question: 'Does a negative result mean I should remove water?',
    answer:
      'No. A negative signed deficit means measured sodium is below desired (free-water excess relative to that target). This worksheet does not prescribe fluids or rates.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your labs or weight.',
  },
];
