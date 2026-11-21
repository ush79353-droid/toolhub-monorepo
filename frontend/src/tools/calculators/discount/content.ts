import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DISCOUNT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-discount', label: 'What Is a Percent-Off Discount?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'discount-formula', label: 'Discount Formulas' },
  { id: 'tax-included', label: 'Tax Included Labeling' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'discount-faq', label: 'Frequently Asked Questions' },
];

export const DISCOUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is a percent-off discount calculated?',
    answer:
      'Discount amount equals original price × discount rate ÷ 100. You pay equals original price minus that discount amount. Savings equals the discount amount. Rates outside 0–100% and negative prices are rejected.',
  },
  {
    question: 'Does “Tax included?” change the math?',
    answer:
      'No. Yes means the original price you entered already includes tax; No means it excludes tax. This tool does not apply or invent a tax rate. Use the toggle only as a reminder of how you labeled the price.',
  },
  {
    question: 'Which discount types are supported?',
    answer:
      'Only percent-off (% off) is implemented. Other types such as fixed dollar off or BOGO are not offered until they are verified in project specifications.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Original price, you pay, and you save each have independent currencies. Discount math runs in the original-price currency at full precision; results convert for display. The discount percent and tax Yes/No choice are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is there a Simple Discount Calculator?',
    answer:
      'A separate Simple Discount Calculator route is not registered in this project yet, so this page does not link to one.',
  },
];
