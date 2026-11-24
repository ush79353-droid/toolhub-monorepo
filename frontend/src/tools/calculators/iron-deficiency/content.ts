import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IRON_DEFICIENCY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Iron Deficiency Calculator' },
  { id: 'ganzoni', label: 'Ganzoni Formula' },
  { id: 'stores', label: 'Iron Store Allowance' },
  { id: 'units', label: 'Units and Limits' },
  { id: 'iron-deficiency-faq', label: 'Frequently Asked Questions' },
];

export const IRON_DEFICIENCY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'It estimates total body iron deficit (mg) with the Ganzoni formula from body weight, actual hemoglobin, target hemoglobin, and a weight-based iron store allowance. The result is an educational estimate of cumulative iron to replete hemoglobin and stores—not a product-specific infusion order.',
  },
  {
    question: 'What is the Ganzoni formula?',
    answer:
      'Deficit (mg) = weight (kg) × (target Hb − actual Hb) (g/dL) × 2.4 + iron stores (mg). Equivalently, with Hb in g/L the factor is 0.24. The 2.4 factor combines approximate blood volume (~7% of body weight) and hemoglobin iron content (0.34%).',
  },
  {
    question: 'How are iron stores chosen?',
    answer:
      'Per common Ganzoni teaching tables (e.g. National Blood Authority Australia guidance): body weight ≥35 kg uses 500 mg stores; weight under 35 kg uses 15 mg/kg. Target Hb is clinician-supplied; classic published teaching targets are often 15 g/dL (≥35 kg) or 13 g/dL (<35 kg), but this tool does not force those defaults.',
  },
  {
    question: 'Is the deficit the same as an IV iron prescription?',
    answer:
      'No. The formula estimates cumulative iron deficit. Allowable dose per infusion, product choice, rounding, and scheduling follow product labeling and local protocols—not this worksheet.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];
