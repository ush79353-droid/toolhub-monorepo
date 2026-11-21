import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

/** Illustrative constant annual declining-balance rate (not a market forecast). */
export const CAR_DEPRECIATION_ANNUAL_RATE = 0.15;

export const CAR_DEPRECIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-car-depreciation', label: 'What Is Car Depreciation?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'car-depreciation-formula', label: 'Depreciation Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'car-depreciation-faq', label: 'Frequently Asked Questions' },
];

export const CAR_DEPRECIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What depreciation rate does this calculator use?',
    answer:
      'It applies a transparent illustrative constant annual rate of 15% with declining-balance compounding: Value = Initial × (1 − 0.15)^t. Real resale prices vary by make, mileage, condition, and market; this is an educational model, not a dealer appraisal.',
  },
  {
    question: 'What is “Reduced car value” versus “Car value after…”?',
    answer:
      'Reduced car value is the estimated value after the entered car age from the initial value. “Car value after…” projects further from that current estimate for 1 minute and 1–5 additional years.',
  },
  {
    question: 'How is the 1-minute value calculated?',
    answer:
      'One minute is treated as a fractional year: 1 ÷ (365.25 × 24 × 60). The same (1 − rate)^t formula is applied to the current reduced value, so the result stays mathematically consistent with the annual model.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Initial value and each monetary result have independent currencies. Math runs in the initial-value currency at full precision; results convert for display. Car age and the depreciation rate are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
