import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARES_TO_CENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'what-are-ares', label: 'What Are Ares?' },
  { id: 'what-are-cents', label: 'What Are Cents?' },
  { id: 'ares-to-cents-formula', label: 'Ares to Cents Formula' },
  { id: 'cents-to-ares-formula', label: 'Cents to Ares Formula' },
  { id: 'conversion-table', label: 'Ares-to-Cents Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'ares-to-cent-faq', label: 'Frequently Asked Questions' },
];

export interface AresCentTableRow {
  ares: string;
  cents: string;
}

export interface AresToCentGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly AresCentTableRow[];
}

export const ARES_TO_CENT_GUIDE_SECTIONS: readonly AresToCentGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter translates land area between metric ares and traditional cents. An are is exactly 100 square meters. A cent is one-hundredth of an international acre, or exactly 40.468564224 square meters. Enter either unit and read the other using those exact definitions.',
      'The tool only scales a known area. It does not survey a parcel or replace a legal land description.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Ares to Cent Calculator',
    paragraphs: [
      'Enter an area in ares to fill cents automatically, or enter cents to fill ares. Incomplete numbers such as a trailing decimal stay editable until you finish typing. Use Copy result for a readable summary, Share when available, or Reset to clear both fields.',
    ],
  },
  {
    id: 'what-are-ares',
    title: 'What Are Ares?',
    paragraphs: [
      'An are is a metric land-area unit equal to exactly 100 square meters. One hectare contains 100 ares (10,000 square meters). Ares appear in land records and planning work where metric units are preferred.',
    ],
  },
  {
    id: 'what-are-cents',
    title: 'What Are Cents?',
    paragraphs: [
      'A cent is a traditional land-area unit used in parts of India for property and agricultural measurements. One cent equals exactly one-hundredth of an international acre, so one cent is 40.468564224 square meters and one acre contains exactly 100 cents.',
      'Land-area cents are unrelated to centimeters (length) or monetary cents.',
    ],
  },
  {
    id: 'ares-to-cents-formula',
    title: 'Ares to Cents Conversion Formula',
    paragraphs: [
      'Divide ares by 0.40468564224 (ares per cent). Example: 5 ares ÷ 0.40468564224 ≈ 12.3552690734 cents.',
    ],
    formula: 'cents = ares ÷ 0.40468564224',
    formulaNote: 'Derived from 1 are = 100 m² and 1 cent = 40.468564224 m².',
  },
  {
    id: 'cents-to-ares-formula',
    title: 'Cents to Ares Conversion Formula',
    paragraphs: [
      'Multiply cents by 0.40468564224. Example: 10 cents × 0.40468564224 = 4.0468564224 ares.',
    ],
    formula: 'ares = cents × 0.40468564224',
  },
  {
    id: 'conversion-table',
    title: 'Ares-to-Cents Conversion Table',
    paragraphs: [
      'Each row uses cents = ares ÷ 0.40468564224.',
    ],
    table: [
      { ares: '0', cents: '0' },
      { ares: '1', cents: '2.47105381467' },
      { ares: '2', cents: '4.94210762934' },
      { ares: '3', cents: '7.41316144401' },
      { ares: '4', cents: '9.88421525868' },
      { ares: '5', cents: '12.3552690734' },
      { ares: '10', cents: '24.7105381467' },
      { ares: '20', cents: '49.4210762934' },
      { ares: '50', cents: '123.552690734' },
      { ares: '100', cents: '247.105381467' },
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Real estate listings, property deeds, agricultural plots, and land documentation often mix metric ares with traditional cents. Converting between them keeps figures comparable when comparing metric and customary land measures.',
      'Use a surveyor or GIS workflow when boundaries matter. This page only converts a known area from one unit into the other.',
    ],
  },
];

export const ARES_TO_CENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert from ares to cents?',
    answer: 'Divide the area in ares by 0.40468564224.',
  },
  {
    question: 'How do I convert from cents to ares?',
    answer: 'Multiply the area in cents by 0.40468564224.',
  },
  {
    question: 'How many cents are in one are?',
    answer: 'One are is approximately 2.47105381467 cents.',
  },
  {
    question: 'How many ares are in one cent?',
    answer: 'One cent equals exactly 0.40468564224 ares.',
  },
  {
    question: 'How many cents are in two ares?',
    answer: '2 ÷ 0.40468564224 ≈ 4.94210762934 cents.',
  },
  {
    question: 'How many square meters are in one cent?',
    answer: 'One cent equals 40.468564224 square meters.',
  },
  {
    question: 'Is a cent the same as a centimeter?',
    answer:
      'No. A cent is a land-area unit (1/100 acre), whereas a centimeter is a unit of length.',
  },
  {
    question: 'How many cents are in one acre?',
    answer: 'One acre contains exactly 100 cents.',
  },
];
