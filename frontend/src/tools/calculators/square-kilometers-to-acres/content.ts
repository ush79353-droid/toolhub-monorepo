import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatArea, squareKilometersToAcres } from './calculation';
import { ACRES_PER_KM2, KM2_PER_ACRE } from './types';

export const SQUARE_KILOMETERS_TO_ACRES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-km2', label: 'What Is a Square Kilometer?' },
  { id: 'what-is-an-acre', label: 'What Is an Acre?' },
  { id: 'km2-to-acres', label: 'How to Convert Square Kilometers to Acres' },
  { id: 'acres-to-km2', label: 'How to Convert Acres to Square Kilometers' },
  { id: 'conversion-table', label: 'Square Kilometers to Acres Conversion Table' },
  { id: 'how-it-works', label: 'How the Converter Works' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'difference', label: 'Difference Between Square Kilometers and Acres' },
  { id: 'square-kilometers-to-acres-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  km2: string;
  acres: string;
}

export interface SquareKilometersToAcresGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_KM2 = [0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 500, 1000] as const;

export const SQUARE_KILOMETERS_TO_ACRES_GUIDE_SECTIONS: readonly SquareKilometersToAcresGuideSection[] =
  [
    {
      id: 'introduction',
      title: 'Introduction',
      paragraphs: [
        'This converter switches land and surface-area measurements between square kilometers (km²) and international acres (ac). Enter either unit and read the matching value instantly.',
        'It helps compare large geographic areas expressed in metric units with acre-based property and agricultural figures. Calculations use exact square-meter definitions—not rounded shortcuts.',
      ],
    },
    {
      id: 'what-is-km2',
      title: 'What Is a Square Kilometer?',
      paragraphs: [
        'A square kilometer is a metric area unit with symbol km². One square kilometer equals exactly 1,000,000 square meters—the area of a square one kilometer on each side. Square kilometers are commonly used for cities, regions, parks, and other large geographic extents.',
      ],
    },
    {
      id: 'what-is-an-acre',
      title: 'What Is an Acre?',
      paragraphs: [
        'An acre is an area unit widely used for land and property. Its symbol is ac. One international acre equals exactly 4,046.8564224 square meters, which is also exactly 43,560 square feet. Acres are common in agriculture and real estate.',
      ],
    },
    {
      id: 'km2-to-acres',
      title: 'How to Convert Square Kilometers to Acres',
      paragraphs: [
        `Multiply square kilometers by ${formatArea(ACRES_PER_KM2)} (that is 1,000,000 ÷ 4,046.8564224). Example: 2 km² ≈ ${formatArea(squareKilometersToAcres(2))} acres.`,
      ],
      formula: 'acres = km² × (1,000,000 / 4,046.8564224)',
      formulaNote: `1 km² ≈ ${formatArea(ACRES_PER_KM2)} international acres.`,
    },
    {
      id: 'acres-to-km2',
      title: 'How to Convert Acres to Square Kilometers',
      paragraphs: [
        `Multiply acres by ${KM2_PER_ACRE}. Example: 250 acres = ${formatArea(250 * KM2_PER_ACRE)} km².`,
      ],
      formula: 'km² = acres × 0.0040468564224',
    },
    {
      id: 'conversion-table',
      title: 'Square Kilometers to Acres Conversion Table',
      paragraphs: [
        'Common values below use the same engine as the calculator. Displayed figures are rounded for reading; the converter keeps full internal precision.',
      ],
      table: TABLE_KM2.map((km2) => ({
        km2: formatArea(km2),
        acres: formatArea(squareKilometersToAcres(km2)),
      })),
    },
    {
      id: 'how-it-works',
      title: 'How the Converter Works',
      paragraphs: [
        'Enter a value in square kilometers or acres. The other field updates immediately. Open More conversion options for square meters, square feet, square yards, hectares, ares, and square miles from the same area. Copy result places a short summary on the clipboard; Reset clears both fields.',
      ],
    },
    {
      id: 'practical-applications',
      title: 'Practical Applications',
      paragraphs: [
        'Use the converter for land surveying notes, agriculture and ranch sizing, real-estate comparisons, geography homework, urban planning, environmental studies, and land-management reports that mix metric and acre-based figures.',
        'This page only converts a known area. It does not survey property or replace legal land records.',
      ],
    },
    {
      id: 'difference',
      title: 'Difference Between Square Kilometers and Acres',
      paragraphs: [
        `Both units measure area. Square kilometers are metric and suited to large geographic regions; acres are often used for property and farmland. One square kilometer is about ${formatArea(ACRES_PER_KM2)} acres—much larger than a single acre.`,
      ],
    },
  ];

export const SQUARE_KILOMETERS_TO_ACRES_FAQS: readonly FAQItem[] = [
  {
    question: 'How many acres are in a square kilometer?',
    answer: `One square kilometer is approximately ${formatArea(ACRES_PER_KM2)} international acres.`,
  },
  {
    question: 'How do I convert square kilometers to acres?',
    answer: 'Multiply square kilometers by 1,000,000 ÷ 4,046.8564224.',
  },
  {
    question: 'How do I convert acres to square kilometers?',
    answer: 'Multiply acres by 0.0040468564224.',
  },
  {
    question: 'How many acres are in 5 square kilometers?',
    answer: `5 km² ≈ ${formatArea(squareKilometersToAcres(5))} acres.`,
  },
  {
    question: 'How many acres are in 10 square kilometers?',
    answer: `10 km² ≈ ${formatArea(squareKilometersToAcres(10))} acres.`,
  },
  {
    question: 'How many square kilometers are in one acre?',
    answer: '1 acre = 0.0040468564224 km².',
  },
  {
    question: 'How many square kilometers are in 100 acres?',
    answer: '100 acres = 0.40468564224 km².',
  },
  {
    question: 'How many square meters are in one square kilometer?',
    answer: 'Exactly 1,000,000 square meters.',
  },
  {
    question: 'What is the difference between acres and square kilometers?',
    answer:
      'Both measure area, but a square kilometer is much larger than an acre—about 247.105 acres per km².',
  },
  {
    question: 'Is one square kilometer larger than 100 acres?',
    answer: 'Yes. One square kilometer is approximately 247.105 acres.',
  },
  {
    question: 'How many hectares are in one square kilometer?',
    answer: 'Exactly 100 hectares.',
  },
  {
    question: 'Can I convert fractional square kilometers to acres?',
    answer: 'Yes. The calculator supports integer and decimal values.',
  },
];
