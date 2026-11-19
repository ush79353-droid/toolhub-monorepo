import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRUMP_TAXES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'trumps-low-tax-bill-explained', label: "Trump's low tax bill explained" },
  { id: 'how-to-use-trumps-tax-calculator', label: 'How to use this calculator' },
  { id: 'how-the-tax-comparison-is-calculated', label: 'How the comparison is calculated' },
  { id: 'understanding-the-limitations', label: 'Understanding the limitations' },
  { id: 'trumps-taxes-faq', label: 'Frequently Asked Questions' },
];

export const TRUMP_TAXES_FAQS: readonly FAQItem[] = [
  {
    question: 'How much federal income tax did Trump reportedly pay?',
    answer:
      'Public reporting around Trump’s released tax information highlighted a $750 federal income tax payment for each of 2016 and 2017. This calculator’s default Trump figure follows that reported amount for illustration. It should not be read as an established 2019 federal income tax liability or as a complete picture of all taxes paid in any year.',
  },
  {
    question: "How do I compare my taxes with Trump's?",
    answer:
      'Enter your example federal income tax amount (the default labeled “Your tax in 2019” matches the reference screenshot) and the Trump comparison figure. The tool shows the ratio, dollar difference, and percentage difference, then optional illustrative purchasing-power rows based on the positive difference.',
  },
  {
    question: 'What does the tax ratio mean?',
    answer:
      'Tax ratio = your tax ÷ Trump’s comparison tax. A ratio of 4 means your example payment is four times the Trump figure. “Times more” language in everyday speech can be ambiguous; this tool reports the multiplicative ratio clearly and also shows the absolute and percentage differences.',
  },
  {
    question: 'Does this calculator estimate my tax liability?',
    answer:
      'No. It does not apply brackets, deductions, credits, payroll taxes, state taxes, or filing status. You supply the tax amounts. It only compares those two numbers and optional illustrative spending conversions.',
  },
  {
    question: 'Are the example product prices current?',
    answer:
      'No. Comparison unit prices are editable illustrative assumptions. Defaults are chosen so quantities match the reference screenshot at $3,202 vs $750. They are not verified current retail prices, and unavailable real-world prices are not invented as market facts.',
  },
];
