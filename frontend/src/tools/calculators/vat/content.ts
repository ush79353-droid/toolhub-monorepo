import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'vat-definition', label: 'What is VAT?' },
  { id: 'vat-gst-sales-tax', label: 'VAT, GST, and sales tax' },
  { id: 'vat-vs-gst', label: 'VAT vs GST' },
  { id: 'margin-and-vat', label: 'Margin and VAT' },
  { id: 'how-to-calculate-vat', label: 'How to calculate VAT' },
  { id: 'vat-refunds', label: 'When can VAT be refunded?' },
  { id: 'vat-by-country', label: 'VAT in different countries' },
  { id: 'tax-system-comparison', label: 'Comparison of tax systems' },
  { id: 'history-of-vat', label: 'History of VAT' },
  { id: 'vat-faq', label: 'Frequently Asked Questions' },
];

export const VAT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is VAT?',
    answer:
      'Value Added Tax (VAT) is a consumption tax charged on the value added at each stage of production and distribution. Businesses typically charge VAT on sales (output VAT) and may recover VAT paid on purchases (input VAT), subject to local rules.',
  },
  {
    question: 'How do I add 20% VAT to a price?',
    answer:
      'Treat the starting price as net (VAT excluded). VAT amount = net × 0.20. Gross = net + VAT. Example: net 100 → VAT 20 → gross 120. Use your actual local rate if it is not 20%.',
  },
  {
    question: 'How do I remove VAT from a total?',
    answer:
      'Divide the gross (VAT-inclusive) price by (1 + rate/100). For 20%: net = gross ÷ 1.20. Do not subtract 20% of the gross — that incorrect shortcut would give 96 instead of 100 from a 120 total.',
  },
  {
    question: 'What is the difference between net and gross prices?',
    answer:
      'Net price excludes VAT. Gross price includes VAT. VAT amount is the difference between gross and net when calculated correctly.',
  },
  {
    question: 'How do I calculate the VAT portion of a VAT-inclusive price?',
    answer:
      'VAT = gross − gross / (1 + rate/100), or equivalently gross × rate / (100 + rate). At 20%: VAT = gross × 20/120.',
  },
  {
    question: 'Can VAT be 0%?',
    answer:
      'Yes. Some supplies are zero-rated (0% VAT charged, with possible recovery rules) or exempt under local law. This calculator accepts a 0% rate mathematically; legal treatment still depends on jurisdiction.',
  },
  {
    question: 'Is VAT the same as GST?',
    answer:
      'Mechanically they are related multi-stage consumption taxes, but names, rates, registration thresholds, and exemptions differ by country. Treat them as related systems, not identical rulesets.',
  },
  {
    question: 'Why do VAT rates differ between countries?',
    answer:
      'Governments set standard and reduced rates, exemptions, and zero-rating policies independently. Rates also change over time and may depend on the type of goods or services. Always confirm the rate that applies to your transaction.',
  },
];
