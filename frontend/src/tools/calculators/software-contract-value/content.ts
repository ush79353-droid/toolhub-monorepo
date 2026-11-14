import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SCV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-software-contract-value', label: 'What is software contract value?' },
  { id: 'scv-formulas', label: 'Formulas' },
  { id: 'scv-example', label: 'Worked example' },
  { id: 'scv-faq', label: 'Frequently asked questions' },
];

export interface ScvGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const SCV_GUIDE_SECTIONS: readonly ScvGuideSection[] = [
  {
    id: 'what-software-contract-value',
    title: 'What is software contract value?',
    paragraphs: [
      'Software contract value estimates the total discounted cost of a seat-based software agreement over its full term. Retail price here is the monthly list price per seat before discount.',
      'Use the same currency for every money field. Changing the currency control only updates the symbol and grouping — it does not convert amounts.',
    ],
  },
  {
    id: 'scv-formulas',
    title: 'Formulas',
    paragraphs: [
      'Discount is applied per seat to the monthly retail price. Monthly cost multiplies the discounted seat price by seats. Contract value multiplies that monthly cost by the total months in the term.',
    ],
    formula:
      'Discount Amount = Retail Price × Discount ÷ 100\nDiscounted Price = Retail Price − Discount Amount\nMonthly Cost = Discounted Price × Seats\nAnnual Cost = Monthly Cost × 12\nContract Months = (Years × 12) + Months\nContract Value = Monthly Cost × Contract Months',
  },
  {
    id: 'scv-example',
    title: 'Worked example',
    paragraphs: [
      'Retail price PKR 1,000 per seat/month, 10 seats, 20% discount, 2 years (0 extra months). Discount amount = 200. Discounted price = 800. Monthly cost = 8,000. Annual cost = 96,000. Contract months = 24. Contract value = 192,000.',
    ],
  },
];

export const SCV_FAQS: readonly FAQItem[] = [
  {
    question: 'Is retail price monthly or annual?',
    answer:
      'Retail price is the monthly list price per seat. Annual cost and contract value are derived from that monthly rate after discount.',
  },
  {
    question: 'What does discount amount mean?',
    answer:
      'It is the currency amount removed from the per-seat monthly retail price: retail × discount ÷ 100. It is calculated automatically.',
  },
  {
    question: 'Can years or months be zero?',
    answer:
      'Yes, either field can be zero, but the total duration in months must be greater than zero.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency control only changes the symbol and grouping. Enter every amount in the same denomination.',
  },
];
