import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const YEARS_DECADES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-decade', label: 'What Is a Decade?' },
  { id: 'years-in-a-decade', label: 'How Many Years Does It Take to Make a Decade?' },
  { id: 'decades-to-years', label: 'How Do I Calculate Decades to Years?' },
  { id: 'how-to-use', label: 'How to Use the Years to Decades Calculator' },
  { id: 'named-decades', label: 'How Do I Refer to a Decade Since the Year 2000?' },
  { id: 'hundred-decades', label: 'What Is 100 Decades in Years?' },
  { id: 'years-chart', label: 'Years to Decades Conversion Chart' },
  { id: 'decades-chart', label: 'Decades to Years Conversion Chart' },
  { id: 'practical-uses', label: 'Practical Applications' },
  { id: 'years-decades-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly [string, string];
  table?: readonly { left: string; right: string }[];
}

export const YEARS_DECADES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-decade',
    title: 'What Is a Decade?',
    paragraphs: [
      'A decade is a period of ten years. The word comes from Greek dekas, “a group of ten.” Historians, demographers, and journalists use decades to summarize change in technology, culture, and population without listing every calendar year.',
      'A ten-year duration is unambiguous: 10 years = 1 decade, 30 years = 3 decades, 50 years = 5 decades, 100 years = 10 decades. Named calendar decades (the 2020s) are labels for a span of years and can follow different conventions, including whether a decade starts on a year ending in 0 or 1 in systems that have no year zero.',
    ],
  },
  {
    id: 'years-in-a-decade',
    title: 'How Many Years Does It Take to Make a Decade?',
    paragraphs: [
      'One decade always contains ten years. Two decades are 20 years, seven and a half decades are 75 years, and ten decades are a century.',
    ],
    formula: '1 decade = 10 years',
  },
  {
    id: 'decades-to-years',
    title: 'How Do I Calculate Decades to Years?',
    paragraphs: [
      'Multiply the number of decades by 10. Example: 1.2 decades × 10 = 12 years. Further examples: 2.5 decades = 25 years; 4 decades = 40 years; 7.5 decades = 75 years.',
    ],
    formula: 'Years = Decades × 10',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Years to Decades Calculator',
    paragraphs: [
      '1. Enter a number of years.',
      '2. Read the automatically calculated decades (years ÷ 10).',
      '3. Or enter decades and read years (decades × 10).',
      '4. Share the conversion, or use Reload / Clear to reset.',
    ],
  },
  {
    id: 'named-decades',
    title: 'How Do I Refer to a Decade Since the Year 2000?',
    paragraphs: [
      'Common English labels: 2000–2009 the 2000s, 2010–2019 the 2010s, 2020–2029 the 2020s, 2030–2039 the 2030s. Those names describe calendar windows. A decade as a duration is still ten years no matter which year it starts.',
    ],
  },
  {
    id: 'hundred-decades',
    title: 'What Is 100 Decades in Years?',
    paragraphs: [
      '100 × 10 = 1,000 years. One thousand years is also one millennium. The calculator treats this as elapsed duration, not as a forecast or a calendar date.',
    ],
    formula: 'Years = Decades × 10 · 100 decades = 1,000 years = 1 millennium',
  },
  {
    id: 'years-chart',
    title: 'Years to Decades Conversion Chart',
    paragraphs: ['Divide years by 10.'],
    tableHeaders: ['Years', 'Decades'],
    table: [
      { left: '1', right: '0.1' },
      { left: '5', right: '0.5' },
      { left: '10', right: '1' },
      { left: '15', right: '1.5' },
      { left: '20', right: '2' },
      { left: '25', right: '2.5' },
      { left: '30', right: '3' },
      { left: '40', right: '4' },
      { left: '50', right: '5' },
      { left: '60', right: '6' },
      { left: '75', right: '7.5' },
      { left: '80', right: '8' },
      { left: '90', right: '9' },
      { left: '100', right: '10' },
      { left: '150', right: '15' },
      { left: '200', right: '20' },
      { left: '500', right: '50' },
      { left: '1,000', right: '100' },
    ],
  },
  {
    id: 'decades-chart',
    title: 'Decades to Years Conversion Chart',
    paragraphs: ['Multiply decades by 10.'],
    tableHeaders: ['Decades', 'Years'],
    table: [
      { left: '0.1', right: '1' },
      { left: '0.25', right: '2.5' },
      { left: '0.5', right: '5' },
      { left: '1', right: '10' },
      { left: '1.5', right: '15' },
      { left: '2', right: '20' },
      { left: '2.5', right: '25' },
      { left: '3', right: '30' },
      { left: '4', right: '40' },
      { left: '5', right: '50' },
      { left: '7.5', right: '75' },
      { left: '10', right: '100' },
      { left: '25', right: '250' },
      { left: '50', right: '500' },
      { left: '100', right: '1,000' },
    ],
  },
  {
    id: 'practical-uses',
    title: 'Practical Applications of Years to Decades Conversion',
    paragraphs: [
      'Use this conversion for historical timelines, personal milestones, academic periodization, population studies, cultural history, and describing long scientific or technological spans. Converting years into decades does not by itself forecast finances or compute calendar dates.',
    ],
  },
];

export const YEARS_DECADES_FAQS: readonly FAQItem[] = [
  {
    question: 'What is 6 decades in years?',
    answer: 'Six decades equal 60 years. 6 × 10 = 60.',
  },
  {
    question: 'What is 4.5 billion years in decades?',
    answer:
      'Divide 4.5 billion by 10: 4,500,000,000 / 10 = 450,000,000 decades (450 million decades).',
  },
  {
    question: 'What is 1.2 decades in years?',
    answer: '1.2 × 10 = 12 years.',
  },
  {
    question: 'How many decades are in 100 years?',
    answer: '100 / 10 = 10 decades.',
  },
  {
    question: 'How many decades are in 50 years?',
    answer: '50 / 10 = 5 decades.',
  },
  {
    question: 'How many years are in 20 decades?',
    answer: '20 × 10 = 200 years.',
  },
  {
    question: 'What is half a decade?',
    answer: 'Half a decade is five years. 0.5 × 10 = 5.',
  },
  {
    question: 'Is a decade always 10 years?',
    answer: 'Yes. As a duration, a decade is defined as ten years.',
  },
  {
    question: 'How many decades are in a century?',
    answer: 'One century contains ten decades.',
  },
  {
    question: 'How many decades are in a millennium?',
    answer: 'One millennium contains 100 decades.',
  },
  {
    question: 'What is the difference between a decade and a century?',
    answer: 'A decade is 10 years; a century is 100 years. 1 century = 10 decades.',
  },
  {
    question: 'How do I convert years to decades?',
    answer: 'Divide years by 10. Example: 85 / 10 = 8.5 decades.',
  },
];
