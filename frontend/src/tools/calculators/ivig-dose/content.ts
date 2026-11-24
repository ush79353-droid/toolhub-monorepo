import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IVIG_DOSE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'weight-basis', label: 'Weight basis' },
  { id: 'products', label: 'IVIG vs RhIG' },
  { id: 'assumptions', label: 'Assumptions & limits' },
  { id: 'faq', label: 'FAQ' },
];

export const IVIG_DOSE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which weight is used for general IVIG dosing?',
    answer:
      'When height is at least 152.4 cm and weight meets the adult Devine floor (male ≥50 kg, female ≥45.5 kg), the tool uses Devine ideal body weight, switches to adjusted body weight when BMI ≥ 30 (IBW + 0.5 × (actual − IBW)), and uses actual weight when it is below ideal. Shorter or lighter patients use actual weight only. Grams = supplied g/kg × dosing weight.',
  },
  {
    question: 'Why is the default dose 1 g/kg?',
    answer:
      '1 g/kg is the labeled Privigen intensity for chronic ITP on each of two consecutive days (DailyMed/FDA). Enter the g/kg your protocol specifies — this worksheet does not invent an indication-specific schedule beyond the arithmetic.',
  },
  {
    question: 'What does Pregnancy hemorrhage calculate?',
    answer:
      'That branch estimates Rh(D) immune globulin (RhIG) vial counts after fetomaternal hemorrhage using maternal Nadler blood volume, % fetal cells, and the AABB Technical Manual rounding rule for 300 µg (30 mL fetal whole-blood) vials. It does not output IVIG grams.',
  },
  {
    question: 'Are patient details stored or shared?',
    answer:
      'No. Inputs stay in the browser. Share copies only the public calculator page URL — never weight, height, dose, or fetal-cell values.',
  },
];
