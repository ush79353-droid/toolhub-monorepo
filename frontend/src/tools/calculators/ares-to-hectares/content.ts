import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARES_TO_HECTARES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-an-are', label: 'What Is an Are?' },
  { id: 'what-is-a-hectare', label: 'What Is a Hectare?' },
  { id: 'ares-to-hectares', label: 'How to Convert Ares to Hectares' },
  { id: 'hectares-to-ares', label: 'How to Convert Hectares to Ares' },
  { id: 'formula', label: 'Are to Hectare Formula' },
  { id: 'conversion-table', label: 'Ares to Hectares Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'ares-to-hectares-faq', label: 'Frequently Asked Questions' },
];

export interface AresHaTableRow {
  ares: string;
  hectares: string;
}

export interface AresToHectaresGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly AresHaTableRow[];
}

export const ARES_TO_HECTARES_GUIDE_SECTIONS: readonly AresToHectaresGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter switches land area between ares and hectares—two related metric units. Because one hectare is exactly 100 ares, the conversion is a simple scale factor with no approximation.',
      'Enter either unit and read the other instantly. Expand More conversion options for square meters, square kilometers, square feet, square yards, acres, and land cents from the same area.',
    ],
  },
  {
    id: 'what-is-an-are',
    title: 'What Is an Are?',
    paragraphs: [
      'An are is a metric area unit equal to exactly 100 square meters. A square measuring 10 meters on each side has an area of one are. One hundred ares make one hectare.',
    ],
  },
  {
    id: 'what-is-a-hectare',
    title: 'What Is a Hectare?',
    paragraphs: [
      'A hectare is a metric area unit equal to exactly 10,000 square meters, or 100 ares. A square measuring 100 meters on each side has an area of one hectare. Hectares are widely used for agricultural and land-area measurements.',
    ],
  },
  {
    id: 'ares-to-hectares',
    title: 'How to Convert Ares to Hectares',
    paragraphs: [
      'Divide the number of ares by 100. Example: 500 ares ÷ 100 = 5 hectares. Two hundred fifty ares ÷ 100 = 2.5 hectares.',
    ],
  },
  {
    id: 'hectares-to-ares',
    title: 'How to Convert Hectares to Ares',
    paragraphs: [
      'Multiply the number of hectares by 100. Example: 7 hectares × 100 = 700 ares. Three point seven five hectares × 100 = 375 ares.',
    ],
  },
  {
    id: 'formula',
    title: 'Are to Hectare Formula',
    paragraphs: [
      'Both directions use the exact factor of 100 ares per hectare.',
    ],
    formula: 'hectares = ares / 100\nares = hectares × 100',
    formulaNote: 'Derived from 1 are = 100 m² and 1 hectare = 10,000 m².',
  },
  {
    id: 'conversion-table',
    title: 'Ares to Hectares Conversion Table',
    paragraphs: [
      'Each row uses hectares = ares ÷ 100.',
    ],
    table: [
      { ares: '0', hectares: '0' },
      { ares: '1', hectares: '0.01' },
      { ares: '5', hectares: '0.05' },
      { ares: '10', hectares: '0.1' },
      { ares: '25', hectares: '0.25' },
      { ares: '50', hectares: '0.5' },
      { ares: '100', hectares: '1' },
      { ares: '200', hectares: '2' },
      { ares: '250', hectares: '2.5' },
      { ares: '500', hectares: '5' },
      { ares: '1,000', hectares: '10' },
      { ares: '2,500', hectares: '25' },
      { ares: '10,000', hectares: '100' },
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Agriculture, real estate listings, property measurement, land planning, and surveying often express the same parcel in ares or hectares. Converting between them keeps metric land figures comparable.',
      'Use a surveyor or GIS workflow when boundaries matter. This page only scales a known area from one unit into the other.',
    ],
  },
];

export const ARES_TO_HECTARES_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate ares from hectares?',
    answer: 'Multiply the number of hectares by 100.',
  },
  {
    question: 'How many ares are in one hectare?',
    answer: 'Exactly 100 ares.',
  },
  {
    question: 'How many hectares are in 200 ares?',
    answer: '200 ÷ 100 = 2 hectares.',
  },
  {
    question: 'How do you convert hectares to ares?',
    answer: 'Multiply hectares by 100. Example: 5 hectares × 100 = 500 ares.',
  },
  {
    question: 'What is one are in square meters?',
    answer: 'One are equals exactly 100 square meters.',
  },
  {
    question: 'What is one hectare in square meters?',
    answer: 'One hectare equals exactly 10,000 square meters.',
  },
  {
    question: 'Is a hectare larger than an are?',
    answer: 'Yes. One hectare is exactly 100 times larger than one are.',
  },
  {
    question: 'How many hectares are in 250 ares?',
    answer: '250 ÷ 100 = 2.5 hectares.',
  },
];
