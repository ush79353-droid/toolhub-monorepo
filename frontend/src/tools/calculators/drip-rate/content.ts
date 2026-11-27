import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DRIP_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Drip Rate Calculator' },
  { id: 'what', label: 'What is the IV drip rate?' },
  { id: 'formula', label: 'Flow rate and drip rate formulas' },
  { id: 'example', label: 'How to calculate the drip rate: an example' },
  { id: 'drip-faq', label: 'Frequently Asked Questions' },
];

export const DRIP_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is drip rate (mL/h) calculated?',
    answer:
      'drip (mL/h) = desired dose (mg/kg/min) × weight (kg) × 60 × 1000 / concentration (mg/L). Concentration may come from drug in bag (mg) × 1000 / bag volume (mL).',
  },
  {
    question: 'How is flow rate (gtts/min) calculated?',
    answer:
      'flow (gtts/min) = drip (mL/h) × drop factor (gtts/mL) / 60. Drop factor comes from the IV tubing set.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not entered doses or weights.',
  },
];
