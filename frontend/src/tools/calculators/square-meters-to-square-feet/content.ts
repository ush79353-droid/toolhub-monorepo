import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatArea,
  squareFeetToSquareMeters,
  squareMetersToSquareFeet,
  SQUARE_FEET_PER_SQUARE_METER,
  SQUARE_METERS_PER_SQUARE_FOOT,
} from './calculation';

export const M2_TO_FT2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Meters to Square Feet Converter' },
  { id: 'about', label: 'Square Meters and Square Feet' },
  { id: 'how-to-m2', label: 'How to Convert Square Meters to Square Feet' },
  { id: 'how-to-ft2', label: 'How to Convert Square Feet to Square Meters' },
  { id: 'conversion-table', label: 'Square Meters to Square Feet Conversion Table' },
  { id: 'related-tools', label: 'Other Area Conversion Tools' },
  { id: 'm2-to-ft2-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_M2 = [1, 2, 5, 10, 20, 25, 50, 75, 100, 250, 500, 1_000] as const;

export const M2_TO_FT2_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Meters to Square Feet Converter',
    paragraphs: [
      'Convert areas measured in square meters into square feet and vice versa. Use it for real estate, room measurements, home renovation, flooring installation, construction projects, architecture, property listings, and interior design.',
      'Enter a measurement in either field for an immediate result. Expand Other Conversion Options for additional area units.',
    ],
  },
  {
    id: 'about',
    title: 'Square Meters and Square Feet',
    paragraphs: [
      'A square meter is an area measuring one meter by one meter. A square foot is an area measuring one foot by one foot. Square meters belong to the metric system; square feet are common in US customary and imperial contexts.',
      'Example: a room 5 meters long and 4 meters wide has area 5 × 4 = 20 m². Converting: 20 × 10.7639104167 ≈ 215.2782 ft². Therefore 20 m² ≈ 215.28 ft².',
      'Converting area differs from converting linear length — area factors are squared length factors.',
    ],
    formula: `5 m × 4 m = 20 m²\n20 × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ≈ ${formatArea(squareMetersToSquareFeet(20))} ft²`,
  },
  {
    id: 'how-to-m2',
    title: 'How to Convert Square Meters to Square Feet',
    paragraphs: [
      `1 m² ≈ ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ft².`,
      `Formula: ft² = m² ÷ ${SQUARE_METERS_PER_SQUARE_FOOT}, or equivalently ft² ≈ m² × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)}.`,
      '1. Identify the area measured in square meters.',
      '2. Multiply by the square-meter-to-square-foot conversion factor.',
      '3. Round the result to the desired precision.',
      '4. Express the result in square feet.',
      `Example — convert 35 m²: 35 × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ≈ ${formatArea(squareMetersToSquareFeet(35))}. Therefore 35 m² ≈ ${formatArea(squareMetersToSquareFeet(35))} ft².`,
    ],
    formula: `ft² = m² ÷ ${SQUARE_METERS_PER_SQUARE_FOOT}\nft² ≈ m² × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)}\n35 × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ≈ ${formatArea(squareMetersToSquareFeet(35))}`,
  },
  {
    id: 'how-to-ft2',
    title: 'How to Convert Square Feet to Square Meters',
    paragraphs: [
      `Formula: m² = ft² × ${SQUARE_METERS_PER_SQUARE_FOOT}.`,
      `Example — convert 250 ft²: 250 × ${SQUARE_METERS_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareMeters(250))}. Therefore 250 ft² = ${formatArea(squareFeetToSquareMeters(250))} m².`,
      'Enter a square-foot value in the calculator to perform the reverse conversion instantly.',
    ],
    formula: `m² = ft² × ${SQUARE_METERS_PER_SQUARE_FOOT}\n250 × ${SQUARE_METERS_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareMeters(250))}`,
  },
  {
    id: 'conversion-table',
    title: 'Square Meters to Square Feet Conversion Table',
    paragraphs: [
      'Common square-meter values with square-foot equivalents from the exact international-foot factor. Displayed decimals are rounded for readability; calculations use full precision.',
    ],
    tableHeaders: ['Square Meters (m²)', 'Square Feet (ft²)'],
    table: TABLE_M2.map((m2) => [
      m2.toLocaleString('en-US'),
      formatArea(squareMetersToSquareFeet(m2)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the Area Converter, Square Feet Converter, Square Meter Converter, Square Feet to Acres Calculator, Square Inch to Square Foot Converter, Acres to Square Feet Converter, Hectares to Acres Converter, and Square Centimeters to Square Millimeters Converter. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const M2_TO_FT2_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Square Meters to Square Feet?',
    answer: `Multiply the area in square meters by approximately ${formatArea(SQUARE_FEET_PER_SQUARE_METER)}. Example: 5 × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ≈ ${formatArea(squareMetersToSquareFeet(5))}. Therefore 5 m² ≈ ${formatArea(squareMetersToSquareFeet(5))} ft².`,
  },
  {
    question: 'How Many Square Feet Are in 56 m²?',
    answer: `56 × ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ≈ ${formatArea(squareMetersToSquareFeet(56))}. Therefore 56 m² ≈ ${formatArea(squareMetersToSquareFeet(56))} ft².`,
  },
  {
    question: 'How Many Square Meters Are in 100 ft²?',
    answer: `Multiply square feet by ${SQUARE_METERS_PER_SQUARE_FOOT}: 100 × ${SQUARE_METERS_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareMeters(100))}. Therefore 100 ft² = ${formatArea(squareFeetToSquareMeters(100))} m².`,
  },
  {
    question: 'Is One Square Meter Equal to 10 Square Feet?',
    answer: `No. One square meter equals approximately ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} square feet. The value 10 ft² is only a rough approximation and should not be used when precise measurements are required.`,
  },
  {
    question: 'How Do I Calculate the Square Footage of a Room?',
    answer:
      'Measure the room’s length and width in feet, then multiply: Area (ft²) = Length (ft) × Width (ft). Example: a 12 ft by 10 ft room has an area of 12 × 10 = 120 ft².',
  },
  {
    question: 'Why Is the Conversion Factor Squared?',
    answer: `Square meters and square feet measure two-dimensional area. Since 1 m ≈ 3.28084 ft, 1 m² ≈ (3.28084)² ft² ≈ ${formatArea(SQUARE_FEET_PER_SQUARE_METER)} ft². Area conversion factors must account for both dimensions.`,
  },
];
