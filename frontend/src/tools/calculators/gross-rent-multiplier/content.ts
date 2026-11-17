import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GROSS_RENT_MULTIPLIER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-grm', label: 'What Is Gross Rent Multiplier?' },
  { id: 'grm-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'grm-faq', label: 'Frequently Asked Questions' },
];

export const GROSS_RENT_MULTIPLIER_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a lower or higher GRM mean?',
    answer:
      'A lower GRM means the property price is smaller relative to annual gross rent. Compare GRM against similar properties in the same market. GRM ignores operating expenses, vacancy, taxes, and financing.',
  },
  {
    question: 'Does monthly rental income work?',
    answer:
      'Yes. Choose mo for monthly income; the calculator multiplies by 12 to get annual gross rental income before dividing into the property price.',
  },
  {
    question: 'Do the currency selectors change the multiplier?',
    answer:
      'Changing a money currency converts that amount with stored MongoDB FX rates so the economics stay the same and the GRM is unchanged. The dimensionless multiplier and the rent period are never FX-converted. Missing rates block cross-currency switches; stale rates show a warning.',
  },
];
