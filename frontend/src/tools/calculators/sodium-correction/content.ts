import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SODIUM_CORRECTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Sodium Correction Calculator' },
  {
    id: 'why-hyperglycemia',
    label: 'Why does hyperglycemia affect sodium?',
  },
  { id: 'how-to-calculate', label: 'How to calculate corrected sodium' },
  { id: 'formula', label: 'Corrected sodium formulas' },
  { id: 'sc-faq', label: 'Frequently Asked Questions' },
];

export const SODIUM_CORRECTION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Hillier corrected sodium formula?',
    answer:
      'Corrected Na (mEq/L) = measured Na + 0.024 × (glucose mg/dL − 100). That is a 2.4 mEq/L rise in sodium for every 100 mg/dL of glucose above 100.',
  },
  {
    question: 'What is the older Katz formula?',
    answer:
      'Corrected Na (mEq/L) = measured Na + 0.016 × (glucose mg/dL − 100), or 1.6 mEq/L per 100 mg/dL glucose above 100. It appears under “Corrected sodium (older version).”',
  },
  {
    question: 'Which glucose units are supported?',
    answer:
      'mg/dL (default) or mmol/L. mmol/L is converted ×18.0182 to mg/dL before either formula. Sodium stays in mEq/L.',
  },
  {
    question: 'Is corrected sodium a treatment target?',
    answer:
      'No. This estimates how much measured sodium is diluted by hyperglycemia. It is not a fluid-order or infusion-rate calculator. Confirm with your clinician as glucose is corrected.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your lab values.',
  },
];
