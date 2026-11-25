import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const URINE_OUTPUT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to use the urine output calculator' },
  {
    id: 'rate-formula',
    label: 'How to calculate urine output in ml/kg/hr',
  },
  { id: 'fluid-balance', label: 'Fluid balance' },
  {
    id: 'normal-output',
    label: "What's the normal hourly urine output?",
  },
  { id: 'urine-output-faq', label: 'Frequently Asked Questions' },
];

export const URINE_OUTPUT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is urine output rate calculated?',
    answer:
      'Divide urine volume (mL) by body weight (kg) and collection time (hours): mL ÷ (kg × h). Example: 1680 mL in 24 h at 70 kg → 1 mL/kg/h.',
  },
  {
    question: 'What is included in fluid balance here?',
    answer:
      'Only measured fluid intake minus urine volume. Insensible losses, sweat, stool, drains, and vomiting are not subtracted unless you enter them elsewhere.',
  },
  {
    question: 'Why are pediatric and adult age groups listed?',
    answer:
      'The math is the same. Teaching thresholds differ: oliguria is often discussed below 1 mL/kg/h in children under 18 versus below 0.5 mL/kg/h in adults — educational bands only.',
  },
  {
    question: 'Are patient values stored or shared?',
    answer:
      'No. Numbers stay in your browser. Share uses the public page URL only.',
  },
];