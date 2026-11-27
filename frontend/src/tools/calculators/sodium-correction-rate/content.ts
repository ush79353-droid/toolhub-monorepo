import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SODIUM_CORRECTION_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Sodium Correction Rate Calculator' },
  { id: 'formula', label: "What's the rate of sodium correction formula?" },
  { id: 'how-to', label: 'How do I use the calculator?' },
  { id: 'scr-faq', label: 'Frequently Asked Questions' },
];

export const SODIUM_CORRECTION_RATE_FAQS: readonly FAQItem[] = [
  {
    question: "What's the Adrogué–Madias formula?",
    answer:
      'Predicted change in serum sodium per liter of fluid = (infusate Na + infusate K − serum Na) ÷ (TBW + 1). Infusion rate (mL/h) = 1000 × aimed hourly change ÷ (ΔNa per liter).',
  },
  {
    question: 'What TBW fractions are used?',
    answer:
      'Child and adult male 0.6; adult female and elderly male 0.5; elderly female 0.45 (Omni teaching set).',
  },
  {
    question: 'How fast is sodium usually corrected?',
    answer:
      'Many experts keep the rise ≤ about 8 mmol/L per day. Severe symptoms may use 1–2 mEq/L/h initially while staying within the daily limit. This worksheet does not prescribe a regimen.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your labs or weight.',
  },
];
