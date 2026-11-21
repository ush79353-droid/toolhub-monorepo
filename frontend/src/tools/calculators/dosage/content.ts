import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Dosage Calculator' },
  { id: 'what-it-does', label: 'What This Calculator Does' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'liquid', label: 'Liquid Medicine' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'dosage-faq', label: 'Frequently Asked Questions' },
];

export const DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this tool recommend a dose?',
    answer:
      'No. Enter a mass-per-kilogram figure that a clinician, protocol, or label already specified. The calculator only converts units and applies frequency arithmetic.',
  },
  {
    question: 'What is the difference between per day and per administration?',
    answer:
      'Per day treats mg/kg (or mcg/kg, g/kg) as a daily rate and divides by how many times you dose each day. Per administration treats the rate as each dose and multiplies by frequency for the daily total.',
  },
  {
    question: 'How is liquid volume calculated?',
    answer:
      'mL per administration = mass per administration ÷ concentration, after converting both into matching mass units (mg, mcg, or g).',
  },
  {
    question: 'Are milligrams and micrograms distinguished?',
    answer:
      'Yes. 1 mg = 1,000 mcg and 1 g = 1,000 mg. Mixing units without conversion would be incorrect; the engine normalizes through milligrams.',
  },
  {
    question: 'Worked example?',
    answer:
      '10 kg × 15 mg/kg per day, once daily → 150 mg per dose. At 25 mg/mL → 6 mL. Twice daily on a per-day basis → 75 mg and 3 mL per administration.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Values stay in the browser for this session. Share copies only the public page URL—not weight or dose figures.',
  },
];
