import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MILLION_BILLION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'convert-millions-billions', label: 'Convert Millions to Billions' },
  { id: 'how-many-millions', label: 'How Many Millions Make a Billion?' },
  { id: 'scientific-notation', label: 'Scientific Notation' },
  { id: 'conversion-table', label: 'Million to Billion Table' },
  { id: 'million-billion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const MILLION_BILLION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the Million to Billion Converter',
    paragraphs: [
      'This tool converts values between millions, billions, and ordinary numbers using the international short-scale system. Enter a value in any field and the other two update immediately.',
      'Steps: (1) type a value in Million, (2) read the matching Billion result, (3) check the Full Number field for the complete figure, or (4) edit Billion or Full Number to work in reverse. Example: 4,500 million → 4.5 billion → 4,500,000,000.',
    ],
  },
  {
    id: 'convert-millions-billions',
    title: 'How to Convert Millions to Billions',
    paragraphs: [
      'One billion equals one thousand million. Divide millions by 1,000 to get billions; multiply billions by 1,000 to get millions. Example: 8,500 ÷ 1,000 = 8.5 billion. Reverse: 7.2 × 1,000 = 7,200 million.',
      'Converting millions to billions is useful when comparing financial figures, populations, business revenue, and large scientific measurements on a common scale.',
    ],
    formula: 'Billions = Millions / 1,000 · Millions = Billions × 1,000',
  },
  {
    id: 'how-many-millions',
    title: 'How Many Millions Does It Take to Make a Billion?',
    paragraphs: [
      'Exactly one thousand millions make one billion: 1 billion = 1,000 million; 2 billion = 2,000 million; 5 billion = 5,000 million; 10 billion = 10,000 million.',
      'In full numbers, 1 million = 1,000,000 and 1 billion = 1,000,000,000, so a billion is one thousand times larger than a million. Short-scale ladder: million = 10⁶, billion = 10⁹, trillion = 10¹².',
    ],
    table: [
      { left: 'Million', right: '1,000,000', third: '10⁶' },
      { left: 'Billion', right: '1,000,000,000', third: '10⁹' },
      { left: 'Trillion', right: '1,000,000,000,000', third: '10¹²' },
    ],
    tableHeaders: ['Unit', 'Number', 'Scientific Notation'],
  },
  {
    id: 'scientific-notation',
    title: 'How to Convert Millions to Billions in Scientific Notation',
    paragraphs: [
      'Scientific notation writes large magnitudes as a coefficient times a power of ten. Because 1 million = 10⁶ and 1 billion = 10⁹, one million equals 10⁻³ billion, or 0.001 billion.',
      'General rule: Billions = Millions × 10⁻³. Example: 25,000 million × 10⁻³ = 25 billion. This form is common in economics, science, astronomy, and statistics.',
    ],
    formula: 'Billions = Millions × 10⁻³',
  },
  {
    id: 'conversion-table',
    title: 'Million to Billion Conversion Table',
    paragraphs: ['Selected short-scale conversions:'],
    table: [
      { left: '1', right: '0.001' },
      { left: '5', right: '0.005' },
      { left: '10', right: '0.01' },
      { left: '25', right: '0.025' },
      { left: '50', right: '0.05' },
      { left: '100', right: '0.1' },
      { left: '250', right: '0.25' },
      { left: '500', right: '0.5' },
      { left: '750', right: '0.75' },
      { left: '1,000', right: '1' },
      { left: '1,500', right: '1.5' },
      { left: '2,000', right: '2' },
      { left: '5,000', right: '5' },
      { left: '10,000', right: '10' },
      { left: '100,000', right: '100' },
    ],
    tableHeaders: ['Million', 'Billion'],
  },
];

export const MILLION_BILLION_FAQS: readonly FAQItem[] = [
  {
    question: 'Is 100 million equal to 1 billion?',
    answer:
      'No. 100 million = 0.1 billion, and 1 billion = 1,000 million. One billion is ten times 100 million.',
  },
  {
    question: 'How much is 2,000 million in billions?',
    answer: '2,000 ÷ 1,000 = 2, so the answer is 2 billion.',
  },
  {
    question: 'How many millions make 1 billion?',
    answer: 'Exactly 1,000 million make one billion. 1,000 million = 1 billion.',
  },
  {
    question: 'How do I convert millions to billions?',
    answer:
      'Divide the number of millions by 1,000. Example: 3,500 million ÷ 1,000 = 3.5 billion.',
  },
  {
    question: 'How do I convert billions to millions?',
    answer:
      'Multiply the number of billions by 1,000. Example: 4.25 billion × 1,000 = 4,250 million.',
  },
  {
    question: 'Is 500 million half a billion?',
    answer: 'Yes. 500 million = 0.5 billion.',
  },
  {
    question: 'What is 10 million in billions?',
    answer: '10 million ÷ 1,000 = 0.01 billion.',
  },
  {
    question: 'How many zeros are in one billion?',
    answer: 'One billion contains nine zeros: 1,000,000,000.',
  },
  {
    question: 'Is one billion equal to 100 crore?',
    answer:
      'Yes, under the international short-scale system: 1 billion = 100 crore, and 1 crore = 10 million.',
  },
];
