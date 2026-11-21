import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AMOXICILLIN_PEDIATRIC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formulas', label: 'Dose and Suspension Math' },
  { id: 'regimens', label: 'Labeled Regimen Sources' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'amox-faq', label: 'Frequently Asked Questions' },
];

export const AMOXICILLIN_PEDIATRIC_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a prescription or medical advice?',
    answer:
      'No. It is an educational conversion helper with labeled pediatric regimen references. Always follow the product leaflet and a licensed clinician’s instructions.',
  },
  {
    question: 'How is oral volume calculated?',
    answer:
      'Dose (mg) = weight (kg) × mg/kg/dose. Suspension strength is mg per 5 mL, so mg/mL = strength ÷ 5, and volume (mL) = dose (mg) ÷ (mg/mL). Example: 150 mg at 125 mg/5 mL → 6 mL.',
  },
  {
    question: 'Why is IV disabled for some indications?',
    answer:
      'Strep A regimens cited here are oral (CDC/IDSA). AHA endocarditis prophylaxis uses oral amoxicillin, or ampicillin/cephalosporin when the patient cannot take oral medicine—not IV amoxicillin. General IV uses a WHO-style informational range only.',
  },
  {
    question: 'What age range is supported?',
    answer:
      '1 month through 18 years. Neonates younger than 1 month are outside this tool’s supported table set.',
  },
  {
    question: 'Are patient details shared or stored?',
    answer:
      'No. Age, weight, and dose stay in your browser session. Share Result copies only the public calculator page URL—not clinical inputs.',
  },
  {
    question: 'Does this use currency conversion?',
    answer:
      'No. Doses are in milligrams and milliliters only.',
  },
];
