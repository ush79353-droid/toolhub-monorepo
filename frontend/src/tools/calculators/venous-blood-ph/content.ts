import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VENOUS_BLOOD_PH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Venous Blood pH Calculator' },
  { id: 'what', label: 'What can you calculate using venous blood gas levels?' },
  {
    id: 'formula',
    label: 'Calculating venous blood gas with the Henderson-Hasselbalch equation',
  },
  { id: 'example', label: 'Worked example' },
  { id: 'vbph-faq', label: 'Frequently Asked Questions' },
];

export const VENOUS_BLOOD_PH_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the estimated venous blood pH calculated?',
    answer:
      'pH = 6.1 + log₁₀(HCO₃ / (0.0308 × PaCO₂ in mmHg)), the Henderson–Hasselbalch teaching form. The result is an estimate, not a directly measured venous laboratory value.',
  },
  {
    question: 'Can I enter PaCO₂ in kPa?',
    answer:
      'Yes. Choose kPa from the unit menu; the calculator converts to mmHg before applying the 0.0308 solubility coefficient. mmHg and torr are treated as equal.',
  },
  {
    question: 'Are mEq/L and mmol/L interchangeable here?',
    answer:
      'For bicarbonate in this worksheet, yes — values in mEq/L equal those in mmol/L.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
