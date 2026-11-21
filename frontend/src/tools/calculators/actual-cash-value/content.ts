import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-acv', label: 'What Is Actual Cash Value?' },
  { id: 'acv-definition', label: 'Actual Cash Value Definition' },
  { id: 'how-to-calculate', label: 'How to Calculate Actual Cash Value' },
  { id: 'worked-example', label: 'Actual Cash Value Calculation Example' },
  { id: 'why-important', label: 'Why Is Actual Cash Value Important?' },
  { id: 'acv-vs-replacement', label: 'ACV vs Replacement Cost' },
  { id: 'depreciation-effect', label: 'How Depreciation Affects ACV' },
  { id: 'useful-life', label: 'What Is Expected Useful Life?' },
  { id: 'common-assets', label: 'ACV of Cars, Electronics, and Property' },
  { id: 'acv-vs-market', label: 'Actual Cash Value vs Market Value' },
  { id: 'limitations', label: 'Limitations of the ACV Calculator' },
  { id: 'acv-faq', label: 'Frequently Asked Questions' },
];

export const ACV_FAQS: readonly FAQItem[] = [
  {
    question: 'Can actual cash value be negative?',
    answer:
      'Not in this calculator. Under the selected zero-salvage straight-line model, ACV is floored at zero when age reaches or exceeds expected life.',
  },
  {
    question: 'How is actual cash value of a car determined?',
    answer:
      'This tool applies purchase price × remaining-life fraction. Real vehicle values also depend on condition, mileage, market prices, and insurer methods, which may differ from straight-line depreciation.',
  },
  {
    question: 'What is the expected life of an item?',
    answer:
      'Expected useful life is an assumed service duration used for depreciation. It can vary by item type, quality, maintenance, usage, and valuation assumptions — there is no single universal life for all items.',
  },
  {
    question: 'What is depreciation?',
    answer:
      'Depreciation is the reduction in an asset’s assigned value over time. This calculator uses a simple straight-line approach based on age relative to expected life.',
  },
  {
    question:
      'What is the actual cash value if the expected life equals the current life?',
    answer:
      'Under this model, ACV is zero when age equals expected life. Actual market or insurance value may still be positive.',
  },
  {
    question: 'How do I calculate accumulated depreciation?',
    answer:
      'Accumulated Depreciation = Purchase Price − ACV. Under the default model it cannot exceed the purchase price.',
  },
  {
    question: 'What is the difference between actual cash value and replacement cost?',
    answer:
      'ACV accounts for depreciation (or other applicable factors) from a valuation basis. Replacement cost is the amount needed to replace property with comparable property under policy terms. Purchase price is not automatically replacement cost.',
  },
  {
    question: 'Can actual cash value be greater than purchase price?',
    answer:
      'Not in this straight-line purchase-price model. Real market prices can appreciate, but this calculator cannot produce ACV above its purchase-price basis.',
  },
  {
    question: 'Does actual cash value include insurance deductibles?',
    answer:
      'No. ACV and deductibles are separate. Deductibles reduce claim payments under policy terms and are not subtracted inside this estimate.',
  },
  {
    question: 'Is actual cash value the same as resale value?',
    answer:
      'No. Resale value depends on market demand, condition, and comparable sales. Depreciation-based ACV is a separate estimate.',
  },
  {
    question:
      'How do I calculate ACV for an item purchased for $10,000 with a 5-year life and age of 2 years?',
    answer:
      'ACV = 10,000 × (5 − 2) / 5 = $6,000 under this calculator’s formula.',
  },
  {
    question: 'What happens if an item’s age exceeds its expected life?',
    answer:
      'This calculator returns zero under its selected model. The item may still be usable or have market/insurance value.',
  },
];
