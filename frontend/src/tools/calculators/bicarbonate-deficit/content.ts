import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BICARBONATE_DEFICIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Bicarbonate Deficit Calculator' },
  { id: 'formula', label: 'How to calculate bicarbonate deficit' },
  { id: 'units', label: 'mmol vs mmol/L' },
  { id: 'limits', label: 'Limits and clinical use' },
  { id: 'bicarb-def-faq', label: 'Frequently Asked Questions' },
];

export const BICARBONATE_DEFICIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate bicarbonate deficit?',
    answer:
      'A common teaching estimate is: deficit (mmol) = 0.5 × body weight (kg) × (desired HCO₃ − actual HCO₃), where bicarbonate levels are in mmol/L. The 0.5 factor is an approximate bicarbonate space in L/kg.',
  },
  {
    question: 'Why is the result labeled mmol instead of mmol/L?',
    answer:
      'Desired and actual bicarbonate are concentrations (mmol/L). Their difference is a concentration gap. Multiplying by weight and the 0.5 L/kg space yields an estimated amount of bicarbonate in mmol (equivalent to mEq), not another concentration.',
  },
  {
    question: 'What happens when actual equals desired?',
    answer:
      'The concentration gap is zero, so the estimated deficit amount is 0 mmol. That does not mean treatment decisions are finished — ongoing losses or acid production can still matter clinically.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your lab values or weight.',
  },
];
