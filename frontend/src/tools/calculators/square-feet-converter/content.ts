import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertArea, formatArea } from './calculation';

export const SQFT_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Feet Converter' },
  { id: 'what-is-a-foot', label: 'What Is a Foot?' },
  { id: 'squaring-up', label: 'Squaring Up the Foot' },
  { id: 'convert-to-other', label: 'Convert Square Feet to Other Surface Area Units' },
  { id: 'conversion-table', label: 'Square Feet Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Square Feet Converter' },
  { id: 'related-tools', label: 'Other Area Conversion Tools' },
  { id: 'sqft-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FT2 = [1, 5, 10, 25, 50, 100, 250, 500, 1_000, 2_000] as const;

export const SQFT_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Feet Converter',
    paragraphs: [
      'Square feet (ft²) measure surface area for rooms, houses, apartments, land, floors, walls, construction projects, real estate, interior design, and building materials.',
      'Use this converter to change square feet into metric or imperial area units (square meters, square inches, square yards, acres, hectares, and more) or reverse the conversion by editing the destination field.',
    ],
  },
  {
    id: 'what-is-a-foot',
    title: 'What Is a Foot?',
    paragraphs: [
      'A foot is a unit of length in the imperial and US customary systems. By international agreement, 1 ft = 12 in and 1 ft = 0.3048 m exactly.',
      'Linear feet measure distance along one dimension. Square feet measure area: the surface of a square that is one foot on each side: 1 ft² = 1 ft × 1 ft.',
    ],
    formula: '1 ft = 12 in\n1 ft = 0.3048 m\n1 ft² = 1 ft × 1 ft',
  },
  {
    id: 'squaring-up',
    title: 'Squaring Up the Foot',
    paragraphs: [
      'A square foot measures area, not length. For a rectangular room, area = length × width. A room that is 12 feet by 10 feet has an area of 12 × 10 = 120 ft².',
      'When converting between linear and square units, conversion factors must be squared. Because 1 ft = 0.3048 m:',
      '1 ft² = (0.3048)² m² = 0.09290304 m².',
      'Using the linear factor alone (0.3048) understates area by a factor of about 0.3048; accurate flooring, carpet, and land calculations need the squared factor.',
    ],
    formula:
      'Area = Length × Width\n12 × 10 = 120 ft²\n1 ft = 0.3048 m\n1 ft² = (0.3048)² m² = 0.09290304 m²',
  },
  {
    id: 'convert-to-other',
    title: 'Convert Square Feet to Other Surface Area Units',
    paragraphs: [
      `Square feet to square meters: m² = ft² × 0.09290304. Example: 100 ft² = ${formatArea(convertArea(100, 'ft2', 'm2'))} m².`,
      `Square feet to square inches: in² = ft² × 144. Example: 1 ft² = ${formatArea(convertArea(1, 'ft2', 'in2'))} in².`,
      `Square feet to square yards: yd² = ft² ÷ 9. Example: 9 ft² = ${formatArea(convertArea(9, 'ft2', 'yd2'))} yd².`,
      `Square feet to acres: ac = ft² ÷ 43,560. Example: 43,560 ft² = ${formatArea(convertArea(43560, 'ft2', 'acre'))} acre.`,
      `Square feet to square centimeters: cm² = ft² × 929.0304. Example: 1 ft² = ${formatArea(convertArea(1, 'ft2', 'cm2'))} cm².`,
    ],
    formula:
      'm² = ft² × 0.09290304\nin² = ft² × 144\nyd² = ft² ÷ 9\nac = ft² ÷ 43,560\ncm² = ft² × 929.0304',
  },
  {
    id: 'conversion-table',
    title: 'Square Feet Conversion Table',
    paragraphs: [
      'Common square-foot values with square-meter and square-yard equivalents from the same conversion engine as the calculator. Displayed decimals are rounded for readability; calculations use full-precision factors.',
    ],
    tableHeaders: ['Square feet', 'Square meters', 'Square yards'],
    table: TABLE_FT2.map((ft2) => [
      formatArea(ft2),
      formatArea(convertArea(ft2, 'ft2', 'm2')),
      formatArea(convertArea(ft2, 'ft2', 'yd2')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Square Feet Converter',
    paragraphs: [
      '1. Enter the area in square feet.',
      '2. Select the target area unit using the dropdown.',
      '3. Read the converted measurement immediately.',
      '4. Change the destination unit to compare different area measurements. the square-feet value stays put.',
      '5. Enter a value in the conversion field to calculate the equivalent square feet.',
      '6. Use Clear All Changes or Reload Calculator to start another calculation.',
      `Example; convert 500 square feet to square meters: 500 × 0.09290304 = ${formatArea(convertArea(500, 'ft2', 'm2'))}. Therefore 500 ft² = ${formatArea(convertArea(500, 'ft2', 'm2'))} m². Edit the meters field to reverse the conversion.`,
    ],
    formula: `500 × 0.09290304 = ${formatArea(convertArea(500, 'ft2', 'm2'))}\n500 ft² = ${formatArea(convertArea(500, 'ft2', 'm2'))} m²`,
  },
  {
    id: 'related-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the general Area Converter, Acres to Square Feet Converter, Hectares to Acres Converter, Square Centimeters to Square Millimeters Converter, Square Kilometers to Acres Conversion, Acres to Square Miles Calculator, and Lot Size to Square Feet Calculator. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const SQFT_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is a Square Foot?',
    answer:
      'A square foot is a unit of area equal to the area of a square with sides measuring one foot. It is commonly written as ft² or sq ft.',
  },
  {
    question: 'How Many Square Inches Are in a Square Foot?',
    answer: `There are 144 square inches in one square foot. Since one foot equals 12 inches, 12 × 12 = 144. Therefore 1 ft² = ${formatArea(convertArea(1, 'ft2', 'in2'))} in².`,
  },
  {
    question: 'How Many Square Meters Are in 100 Square Feet?',
    answer: `Multiply 100 by 0.09290304: 100 × 0.09290304 = ${formatArea(convertArea(100, 'ft2', 'm2'))}. Therefore 100 ft² = ${formatArea(convertArea(100, 'ft2', 'm2'))} m².`,
  },
  {
    question: 'Is a Square Foot the Same as a Foot?',
    answer:
      'No. A foot measures length, while a square foot measures area. A square foot represents a two-dimensional surface, such as a 1-foot-by-1-foot square.',
  },
  {
    question: 'How Many Square Feet Are in One Square Meter?',
    answer: `One square meter is approximately ${formatArea(convertArea(1, 'm2', 'ft2'))} square feet (1 m² ≈ ${formatArea(convertArea(1, 'm2', 'ft2'))} ft²).`,
  },
  {
    question: 'How Do I Calculate the Square Feet of a Room?',
    answer:
      'Measure the room’s length and width in feet, then multiply them. For a rectangular room: Area (ft²) = Length (ft) × Width (ft). Example: a 15-foot-by-12-foot room has an area of 15 × 12 = 180 ft².',
  },
];
