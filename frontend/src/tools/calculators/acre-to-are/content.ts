import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACRE_TO_ARE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-are-acre-and-are', label: 'What Are an Acre and an Are?' },
  { id: 'how-to-use', label: 'How to Use the Tool' },
  { id: 'acres-to-ares-formula', label: 'Formula: Acres to Ares' },
  { id: 'ares-to-acres-formula', label: 'Formula: Ares to Acres' },
  { id: 'conversion-table', label: 'Acre to Are Conversion Table' },
  { id: 'significance', label: 'Why Convert Acres to Ares?' },
  { id: 'acre-to-are-faq', label: 'Frequently Asked Questions' },
];

export interface AcreAreTableRow {
  acres: string;
  ares: string;
}

export interface AcreToAreGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly AcreAreTableRow[];
}

export const ACRE_TO_ARE_GUIDE_SECTIONS: readonly AcreToAreGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator converts land area between acres and ares. Acres appear in US and UK land records; ares belong to the metric system and underpin the hectare. Enter either unit and read the other instantly using exact international factors.',
      'The conversion is a pure unit change. It does not survey a parcel or replace a legal description.',
    ],
  },
  {
    id: 'what-are-acre-and-are',
    title: 'What Are an Acre (ac) and an Are (a)?',
    paragraphs: [
      'An acre is a customary land-area unit still used in countries such as the United States and the United Kingdom. One acre equals exactly 4,046.8564224 square meters.',
      'An are is a metric area unit equal to exactly 100 square meters. One hectare equals 100 ares, or 10,000 square meters. Because one acre is 4,046.8564224 m², one acre equals exactly 40.468564224 ares.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Acre to Are Conversion Tool',
    paragraphs: [
      'Enter an area in acres to fill ares automatically, or enter ares to fill acres. Incomplete numbers such as a trailing decimal stay editable until you finish typing. Use Copy result for a readable summary, or Reset to clear both fields.',
    ],
  },
  {
    id: 'acres-to-ares-formula',
    title: 'Formula to Convert Acres to Ares',
    paragraphs: [
      'Multiply acres by 40.468564224. Example: 5 acres × 40.468564224 = 202.34282112 ares. Thirty-two acres × 40.468564224 = 1,294.994055168 ares.',
    ],
    formula: 'ares = acres × 40.468564224',
    formulaNote: 'Derived from 1 acre = 4,046.8564224 m² and 1 are = 100 m².',
  },
  {
    id: 'ares-to-acres-formula',
    title: 'Formula to Convert Ares to Acres',
    paragraphs: [
      'Divide ares by 40.468564224. Example: 100 ares ÷ 40.468564224 ≈ 2.47105381467 acres. Forty point four six eight five six four two two four ares equal exactly one acre.',
    ],
    formula: 'acres = ares ÷ 40.468564224',
  },
  {
    id: 'conversion-table',
    title: 'Acre to Are Conversion Table',
    paragraphs: [
      'Each row uses ares = acres × 40.468564224.',
    ],
    table: [
      { acres: '0', ares: '0' },
      { acres: '0.5', ares: '20.234282112' },
      { acres: '1', ares: '40.468564224' },
      { acres: '2', ares: '80.937128448' },
      { acres: '5', ares: '202.34282112' },
      { acres: '10', ares: '404.68564224' },
      { acres: '25', ares: '1,011.7141056' },
      { acres: '100', ares: '4,046.8564224' },
    ],
  },
  {
    id: 'significance',
    title: 'Significance of Converting Acres to Ares',
    paragraphs: [
      'Land measurement, agricultural planning, real estate listings, and cross-border property comparisons often mix customary and metric area units. Converting acres to ares (and onward to hectares) keeps those figures comparable without changing the underlying parcel.',
      'Use a surveyor or GIS workflow when boundaries matter. This page only scales a known area from one unit into the other.',
    ],
  },
];

export const ACRE_TO_ARE_FAQS: readonly FAQItem[] = [
  {
    question: 'How many ares are in one acre?',
    answer: 'One acre equals exactly 40.468564224 ares.',
  },
  {
    question: 'How do I convert acres to ares?',
    answer: 'Multiply the number of acres by 40.468564224.',
  },
  {
    question: 'How do I convert ares to acres?',
    answer: 'Divide the number of ares by 40.468564224.',
  },
  {
    question: 'How many ares are in 32 acres?',
    answer: '32 × 40.468564224 = 1,294.994055168 ares.',
  },
  {
    question: 'Is an acre larger than an are?',
    answer: 'Yes. One acre is approximately 40.47 times the size of one are.',
  },
  {
    question: 'How many ares are in one hectare?',
    answer: 'One hectare equals exactly 100 ares.',
  },
  {
    question: 'Can I convert fractional acres to ares?',
    answer: 'Yes. The conversion works with whole numbers and decimal values.',
  },
];
