import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { acresToSquareFeet, formatArea, squareFeetToAcres } from './calculation';
import { SQUARE_FEET_PER_ACRE } from './types';

export const ACRES_TO_SQUARE_FEET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert-acres-to-square-feet', label: 'How to Convert Acres to Square Feet' },
  { id: 'how-many-square-feet-in-an-acre', label: 'How Many Square Feet Are in an Acre?' },
  { id: 'acreage-equal-to-100-square-feet', label: 'How Much Acreage Is Equal to 100 Square Feet?' },
  { id: 'what-is-an-acre', label: 'What Is an Acre?' },
  { id: 'what-is-a-square-foot', label: 'What Is a Square Foot?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'other-area-tools', label: 'Other Area Conversion Tools' },
  { id: 'acres-to-square-feet-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ACRES = [
  0, 0.001, 0.01, 0.1, 0.25, 0.5, 1, 2, 5, 10, 50, 100, 500, 1000,
] as const;

export const ACRES_TO_SQUARE_FEET_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert-acres-to-square-feet',
    title: 'How to Convert Acres to Square Feet',
    paragraphs: [
      'An acre is a large unit of land area. A square foot (ft²) is a smaller area unit equal to a one-foot by one-foot square. Surveyors, real-estate listings, and construction estimates often switch between the two.',
      `The exact relationship is 1 acre = ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet.`,
      `Formula: square feet = acres × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}. Example: 500 acres × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acresToSquareFeet(500))} ft².`,
      `Reverse: acres = square feet ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}. Example: 87,120 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(squareFeetToAcres(87_120))} acres.`,
    ],
    formula: `ft² = acres × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} · acres = ft² ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}`,
    tableHeaders: ['Acres', 'Square Feet'],
    table: TABLE_ACRES.map((ac) => [formatArea(ac), formatArea(acresToSquareFeet(ac))]),
  },
  {
    id: 'how-many-square-feet-in-an-acre',
    title: 'How Many Square Feet Are in an Acre?',
    paragraphs: [
      `One acre contains exactly ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet.`,
      'Acres are convenient for farms, residential lots, large gardens, construction sites, and property listings. Square feet are better when you need finer detail on floor plates, pads, or smaller parcels.',
      'An acre measures surface area, not a fixed width or length. A square about 208.71 feet on each side has an area of one acre, but real parcels are often irregular.',
    ],
    formula: `1 acre = ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ft²`,
  },
  {
    id: 'acreage-equal-to-100-square-feet',
    title: 'How Much Acreage Is Equal to 100 Square Feet?',
    paragraphs: [
      `Divide square feet by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}: 100 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(100))} acres (about 0.002296 acres).`,
      'Fractional acres are useful for decks, sheds, patios, and other compact land areas that would look awkward written as whole acres.',
    ],
    formula: `Acres = Square Feet ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}`,
  },
  {
    id: 'what-is-an-acre',
    title: 'What Is an Acre?',
    paragraphs: [
      'An acre is a unit of area commonly used in the United States and other countries for measuring land.',
      `One international acre equals exactly ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet, 4,840 square yards, and approximately 4,046.8564224 square meters.`,
      'Acres describe surface area only. A long narrow strip and a nearly square lot can both be one acre if they enclose the same area.',
    ],
    formula: '1 acre = 43,560 ft² = 4,840 yd² ≈ 4,046.8564224 m²',
  },
  {
    id: 'what-is-a-square-foot',
    title: 'What Is a Square Foot?',
    paragraphs: [
      'A square foot is the area of a square measuring one foot on each side. It is written as ft² and is common for building floors, rooms, and smaller plots.',
      'Related exact factors include 1 ft² = 144 in² and 1 ft² = 0.09290304 m².',
      'Large tracts are usually quoted in acres because listing millions of square feet is harder to read at a glance.',
    ],
    formula: '1 ft² = 144 in² = 0.09290304 m²',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Acres to Square Feet Converter',
    paragraphs: [
      '1. Open the Acres to Square Feet Converter.',
      '2. Enter the area in acres. square feet update instantly.',
      '3. Or enter square feet to calculate acres.',
      '4. Change either value for another conversion; no Calculate button is required.',
      '5. Use Share Result or Copy Result when you need the pair elsewhere.',
      '6. Reload restores the default (1 acre); Clear empties both fields.',
      'The conversion updates live and does not require an account.',
    ],
  },
  {
    id: 'other-area-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Depending on your dataset you may also need hectares, square miles, square yards, or a multi-unit area converter.',
      'Related Omega Calculators pages that already exist include Area Converter, Acres to Hectares Converter, Acres to Square Miles Calculator, Acreage Calculator, Yards to Acres Calculator, Ares to Hectares Converter, and Feet and Inches Calculator.',
    ],
  },
];

export const ACRES_TO_SQUARE_FEET_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 Acre to Square Feet?',
    answer: `Multiply acres by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}: 1 × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acresToSquareFeet(1))} ft². One acre equals ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet.`,
  },
  {
    question: 'How Many Square Feet Are in Half an Acre?',
    answer: `0.5 × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acresToSquareFeet(0.5))} ft².`,
  },
  {
    question: 'How Many Square Feet Are in a Quarter Acre?',
    answer: `0.25 × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acresToSquareFeet(0.25))} ft².`,
  },
  {
    question: 'How Many Acres Are 100,000 Square Feet?',
    answer: `100,000 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(100_000))} acres (about 2.296 acres).`,
  },
  {
    question: 'How Many Acres Are in One Million Square Feet?',
    answer: `1,000,000 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(1_000_000))} acres.`,
  },
  {
    question: 'How Do I Convert Square Feet to Acres?',
    answer: `Divide square feet by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}. Example: 200,000 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(200_000))} acres.`,
  },
  {
    question: 'Is an Acre Always 43,560 Square Feet?',
    answer:
      'Yes. The international acre is defined as exactly 43,560 international square feet.',
  },
  {
    question: 'What Is the Difference Between an Acre and a Square Foot?',
    answer: `Both measure area, but an acre is much larger. One acre contains ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet.`,
  },
];
