import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  acresToSquareFeet,
  formatArea,
  squareFeetToAcres,
  SQUARE_FEET_PER_ACRE,
} from './calculation';

export const SQFT_TO_ACRES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Feet to Acres Calculator' },
  { id: 'definitions', label: 'Square Feet and Acres Definitions' },
  { id: 'how-many', label: 'How Many Square Feet to an Acre?' },
  { id: 'how-to-convert', label: 'How to Convert Square Feet to Acres?' },
  { id: 'how-to-use', label: 'How to Use the Square Feet to Acres Calculator' },
  { id: 'conversion-table', label: 'Square Feet to Acres Conversion Table' },
  { id: 'related-tools', label: 'Other Useful Area Conversion Tools' },
  { id: 'sqft-to-acres-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FT2 = [
  1, 100, 500, 1_000, 2_500, 5_000, 10_000, 21_780, 43_560, 65_340, 87_120, 100_000,
] as const;

export const SQFT_TO_ACRES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Feet to Acres Calculator',
    paragraphs: [
      'Convert square feet into acres and acres back into square feet for land measurement, real estate, agricultural fields, property lots, construction planning, landscaping, and surveying.',
      'An acre is much larger than a square foot, so acres are a convenient way to describe land parcels while square feet remain useful for smaller surfaces and floor areas.',
    ],
  },
  {
    id: 'definitions',
    title: 'Square Feet and Acres Definitions',
    paragraphs: [
      'What is a square foot? A square foot is a unit of area equal to a square measuring one foot on each side. Exactly 1 ft² = 144 in². Square feet are common for rooms, apartments, floors, and houses.',
      `What is an acre? An acre is a unit of land area used in the United States and other customary land systems. Exact relationships: 1 acre = ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ft² = 4,840 yd² = 4,046.8564224 m².`,
      'Acres are more convenient for describing large properties and land parcels because listing hundreds of thousands of square feet is harder to read at a glance.',
    ],
    formula: `1 ft² = 144 in²\n1 acre = ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ft²\n1 acre = 4,840 yd²\n1 acre = 4,046.8564224 m²`,
  },
  {
    id: 'how-many',
    title: 'How Many Square Feet to an Acre?',
    paragraphs: [
      `One acre contains exactly ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet.`,
      `Acres from square feet: ac = ft² ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}.`,
      `Square feet from acres: ft² = ac × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}.`,
      `Example; convert 10,000 square feet to acres: 10,000 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(10_000))}. Therefore 10,000 ft² ≈ ${formatArea(squareFeetToAcres(10_000))} acres.`,
      `Example; convert 2 acres to square feet: 2 × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acresToSquareFeet(2))}. Therefore 2 acres = ${formatArea(acresToSquareFeet(2))} ft².`,
    ],
    formula: `ac = ft² ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}\nft² = ac × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Square Feet to Acres?',
    paragraphs: [
      '1. Measure or determine the area in square feet.',
      `2. Divide that area by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}.`,
      '3. The result is the equivalent area in acres.',
      `Example; convert 65,340 square feet to acres: 65,340 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(squareFeetToAcres(65_340))}. Therefore 65,340 ft² = ${formatArea(squareFeetToAcres(65_340))} acres.`,
      `Reverse: multiply acres by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} to get square feet.`,
    ],
    formula: `65,340 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(squareFeetToAcres(65_340))}\n65,340 ft² = ${formatArea(squareFeetToAcres(65_340))} acres`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Square Feet to Acres Calculator',
    paragraphs: [
      '1. Enter the square feet measurement into the first input.',
      '2. Read the automatically calculated acres.',
      '3. Alternatively, enter acres to calculate square feet.',
      '4. Expand Other area units to view another equivalent area measurement.',
      '5. Select another area unit from the dropdown when needed. the square-feet value stays put.',
      '6. Use Reload Calculator or Clear All Changes to start again.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Square Feet to Acres Conversion Table',
    paragraphs: [
      'Common square-foot values with acre equivalents from the exact 43,560 factor. Displayed decimals are rounded for readability; calculations use full precision.',
    ],
    tableHeaders: ['Square feet', 'Acres'],
    table: TABLE_FT2.map((ft2) => [
      ft2.toLocaleString('en-US'),
      formatArea(squareFeetToAcres(ft2)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Useful Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the Area Converter, Square Feet Converter, Acres to Square Feet Converter, Hectares to Acres Converter, Square Centimeters to Square Millimeters Converter, Square Kilometers to Acres Conversion, Acres to Square Miles Calculator, and Lot Size to Square Feet Calculator. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const SQFT_TO_ACRES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Acres Are in 10,000 Square Feet?',
    answer: `Divide by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}: 10,000 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(10_000))}. Therefore 10,000 square feet is approximately ${formatArea(squareFeetToAcres(10_000))} acres.`,
  },
  {
    question: 'How Many Square Feet Are in One Acre?',
    answer: `There are exactly ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet in one acre. This conversion factor is used for land measurements and property calculations.`,
  },
  {
    question: 'How Many Acres Is a Football Field?',
    answer: `A standard American football field including both end zones measures 360 feet by 160 feet, so 360 × 160 = 57,600 ft². Converting: 57,600 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(57_600))}. A complete American football field including end zones covers approximately ${formatArea(squareFeetToAcres(57_600))} acres.`,
  },
  {
    question: 'How Many Acres Are in 100,000 Square Feet?',
    answer: `100,000 ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} ≈ ${formatArea(squareFeetToAcres(100_000))}. Therefore 100,000 square feet is approximately ${formatArea(squareFeetToAcres(100_000))} acres.`,
  },
  {
    question: 'How Do I Convert Acres Back to Square Feet?',
    answer: `Multiply acres by ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')}. Example: 3 × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acresToSquareFeet(3))}. Therefore 3 acres = ${formatArea(acresToSquareFeet(3))} square feet.`,
  },
  {
    question: 'Is an Acre the Same as a Square Foot?',
    answer: `No. Both measure area, but they represent different sizes. One acre equals ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} square feet. Square feet are commonly used for smaller areas, while acres are useful for measuring land and larger properties.`,
  },
];
