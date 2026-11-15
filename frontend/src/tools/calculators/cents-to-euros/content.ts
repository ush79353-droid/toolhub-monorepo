import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CENTS_EUROS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-cents-euros', label: 'What Are Euro Cents and Euros?' },
  { id: 'cents-to-euros', label: 'Convert Cents to Euros' },
  { id: 'euros-to-cents', label: 'Convert Euros to Cents' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'conversion-table', label: 'Common Conversions' },
  { id: 'euro-coins', label: 'Euro Coins and Denominations' },
  { id: 'cents-euros-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const CENTS_EUROS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-cents-euros',
    title: 'What Are Euro Cents and the Euro Currency?',
    paragraphs: [
      'The euro (€) is the official currency of the euro area. It is subdivided into 100 euro cents. The euro began as an accounting currency in 1999, and euro banknotes and coins entered circulation in 2002.',
      'A euro cent is a denomination of the same currency, not a separate foreign currency. This calculator converts between those denominations with a fixed factor of 100—no exchange rate is involved.',
    ],
    formula: '1 euro = 100 cents · 1 cent = €0.01 · 10 cents = €0.10 · 50 cents = €0.50',
  },
  {
    id: 'cents-to-euros',
    title: 'How to Convert Cents to Euros',
    paragraphs: [
      'Divide the number of cents by 100. Example: 250 ÷ 100 = 2.5, so 250 cents = €2.50. Another example: 75 ÷ 100 = €0.75.',
      'Fractional cents are allowed mathematically (for example 0.5 cent = €0.005) even though physical euro coins are whole-cent denominations.',
    ],
    formula: 'Euros = Cents / 100',
  },
  {
    id: 'euros-to-cents',
    title: 'How to Convert Euros to Cents',
    paragraphs: [
      'Multiply the euro amount by 100. Example: €12.50 × 100 = 1,250 cents.',
    ],
    formula: 'Cents = Euros × 100',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Cents to Euros Calculator',
    paragraphs: [
      'Enter an amount in Cents and the euro equivalent updates immediately, or enter Euros and the cents field updates. Use Copy or Share to save the conversion, and Reload to restore 100 cents = €1. Example: 375 cents → €3.75.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Common Cent to Euro Conversions',
    paragraphs: ['Selected exact conversions:'],
    table: [
      { left: '1', right: '€0.01' },
      { left: '2', right: '€0.02' },
      { left: '5', right: '€0.05' },
      { left: '10', right: '€0.10' },
      { left: '20', right: '€0.20' },
      { left: '25', right: '€0.25' },
      { left: '50', right: '€0.50' },
      { left: '75', right: '€0.75' },
      { left: '100', right: '€1.00' },
      { left: '200', right: '€2.00' },
      { left: '500', right: '€5.00' },
      { left: '1,000', right: '€10.00' },
      { left: '2,500', right: '€25.00' },
      { left: '5,000', right: '€50.00' },
      { left: '10,000', right: '€100.00' },
    ],
    tableHeaders: ['Cents', 'Euros'],
  },
  {
    id: 'euro-coins',
    title: 'Euro Coins and Denominations',
    paragraphs: [
      'Standard circulating euro coins are 1, 2, 5, 10, 20, and 50 cents, plus €1 and €2 coins (100 cents and 200 cents). Some euro-area countries apply cash-rounding rules to final cash payments; that practice does not change the mathematical value of a cent or this converter’s fixed 100-cents-per-euro relationship.',
    ],
  },
];

export const CENTS_EUROS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert cents to euros?',
    answer: 'Divide the number of cents by 100. For example, 350 ÷ 100 = 3.5, so 350 cents = €3.50.',
  },
  {
    question: 'How many cents are in one euro?',
    answer: 'There are exactly 100 cents in one euro.',
  },
  {
    question: 'How much are 100 cents?',
    answer: '100 euro cents equal €1.',
  },
  {
    question: 'How much are 50 cents in euros?',
    answer: '50 cents equal €0.50.',
  },
  {
    question: 'How much are 25 cents in euros?',
    answer: '25 cents equal €0.25.',
  },
  {
    question: 'How much are 500 cents in euros?',
    answer: '500 cents equal €5.',
  },
  {
    question: 'How much are 1,000 cents in euros?',
    answer: '1,000 cents equal €10.',
  },
  {
    question: 'How many cents are in €2.50?',
    answer: '€2.50 equals 250 cents.',
  },
  {
    question: 'How many cents are in €10?',
    answer: '€10 equals 1,000 cents.',
  },
  {
    question: 'Is a cent the same as a euro?',
    answer: 'No. One cent is one-hundredth of a euro.',
  },
  {
    question: 'Which euro coins are available?',
    answer:
      'Standard euro coins have denominations of 1, 2, 5, 10, 20, and 50 cents, plus €1 and €2.',
  },
  {
    question: 'Can cents be converted into euros without an exchange rate?',
    answer:
      'Yes. Euro cents and euros are denominations of the same currency. The fixed relationship is 100 cents per euro.',
  },
];
