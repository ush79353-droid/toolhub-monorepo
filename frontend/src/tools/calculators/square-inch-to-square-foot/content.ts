import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatArea,
  squareFeetToSquareInches,
  squareInchesToSquareFeet,
  SQUARE_INCHES_PER_SQUARE_FOOT,
} from './calculation';

export const IN2_FT2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Inch to Square Foot Converter' },
  { id: 'definitions', label: 'Square Inches and Square Feet; Imperial Units of Area' },
  { id: 'how-to-in2', label: 'How to Convert Square Inches to Square Feet' },
  { id: 'how-to-ft2', label: 'How to Convert Square Feet to Square Inches' },
  { id: 'how-to-use', label: 'How to Use the Square Inch to Square Foot Converter' },
  { id: 'conversion-table', label: 'Square Inches to Square Feet Conversion Table' },
  { id: 'related-tools', label: 'More Area Conversion Tools' },
  { id: 'in2-ft2-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_IN2 = [
  1, 10, 25, 36, 50, 72, 100, 144, 200, 288, 400, 576, 720, 1_000, 1_440,
] as const;

export const IN2_FT2_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Inch to Square Foot Converter',
    paragraphs: [
      'Convert area measurements between square inches (in²) and square feet (ft²). Use it for flooring, tiles, carpeting, construction, interior design, woodworking, surface measurement, and home improvement.',
      'Square inches suit smaller surfaces; square feet are more convenient for larger rooms and floor areas. Both fields update in real time.',
    ],
  },
  {
    id: 'definitions',
    title: 'Square Inches and Square Feet; Imperial Units of Area',
    paragraphs: [
      'Square inches and square feet are common area units in the US customary and imperial systems.',
      'What is a square inch? A square inch is the area of a square with sides measuring one inch each: 1 in² = 1 in × 1 in. It is useful for small objects, materials, panels, and tiles.',
      'What is a square foot? A square foot is the area of a square measuring one foot on each side. Since 1 ft = 12 in: 1 ft² = 12 in × 12 in = 144 in².',
      'Why is the conversion factor 144? Linear length uses 1 ft = 12 in. Area uses the squared factor: 1 ft² = 12² in² = 144 in². Area conversions always use squared length factors; never divide by 12 alone.',
    ],
    formula: `1 in² = 1 in × 1 in\n1 ft = 12 in\n1 ft² = 12 × 12 = ${SQUARE_INCHES_PER_SQUARE_FOOT} in²`,
  },
  {
    id: 'how-to-in2',
    title: 'How to Convert Square Inches to Square Feet',
    paragraphs: [
      `Formula: ft² = in² ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT}.`,
      '1. Determine the measurement in square inches.',
      `2. Divide by ${SQUARE_INCHES_PER_SQUARE_FOOT}.`,
      '3. The result is the equivalent area in square feet.',
      `Example; convert 400 square inches: 400 ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} ≈ ${formatArea(squareInchesToSquareFeet(400))}. Therefore 400 in² ≈ ${formatArea(squareInchesToSquareFeet(400))} ft².`,
      `Example; convert 576 square inches: 576 ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareInchesToSquareFeet(576))}. Therefore 576 in² = ${formatArea(squareInchesToSquareFeet(576))} ft².`,
    ],
    formula: `ft² = in² ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT}\n400 ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} ≈ ${formatArea(squareInchesToSquareFeet(400))}\n576 ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareInchesToSquareFeet(576))}`,
  },
  {
    id: 'how-to-ft2',
    title: 'How to Convert Square Feet to Square Inches',
    paragraphs: [
      `Formula: in² = ft² × ${SQUARE_INCHES_PER_SQUARE_FOOT}.`,
      `Example; convert 3 square feet: 3 × ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareInches(3))}. Therefore 3 ft² = ${formatArea(squareFeetToSquareInches(3))} in².`,
      `Example; convert 2.5 square feet: 2.5 × ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareInches(2.5))}. Therefore 2.5 ft² = ${formatArea(squareFeetToSquareInches(2.5))} in².`,
    ],
    formula: `in² = ft² × ${SQUARE_INCHES_PER_SQUARE_FOOT}\n3 × ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareInches(3))}\n2.5 × ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareInches(2.5))}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Square Inch to Square Foot Converter',
    paragraphs: [
      '1. Locate the Square inches input.',
      '2. Enter the area measurement in square inches.',
      '3. The calculator automatically converts the value into square feet.',
      '4. To reverse the conversion, enter a value in the Square feet input.',
      '5. The square inches field updates automatically.',
      '6. Use Share Result to copy or share the conversion.',
      '7. Use Reload Calculator or Clear All Changes to start a new calculation.',
      'No manual conversion is required; both fields update in real time.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Square Inches to Square Feet Conversion Table',
    paragraphs: [
      `Common square-inch values with square-foot equivalents from the exact factor ${SQUARE_INCHES_PER_SQUARE_FOOT}. Displayed decimals are rounded for readability; calculations use full precision.`,
    ],
    tableHeaders: ['Square inches', 'Square feet'],
    table: TABLE_IN2.map((in2) => [
      in2.toLocaleString('en-US'),
      formatArea(squareInchesToSquareFeet(in2)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'More Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the Area Converter, Square Feet Converter, Square Feet to Acres Calculator, Acres to Square Feet Converter, Hectares to Acres Converter, Square Centimeters to Square Millimeters Converter, Square Kilometers to Acres Conversion, and Lot Size to Square Feet Calculator. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const IN2_FT2_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Square Feet Are in a Square Inch?',
    answer: `One square inch equals 1/${SQUARE_INCHES_PER_SQUARE_FOOT} ft², approximately ${formatArea(squareInchesToSquareFeet(1))} ft². To convert square inches to square feet, divide by ${SQUARE_INCHES_PER_SQUARE_FOOT}.`,
  },
  {
    question: 'How Many Square Feet Are in 20 Inches by 20 Inches?',
    answer: `First calculate the area: 20 × 20 = 400 in². Then convert: 400 ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} ≈ ${formatArea(squareInchesToSquareFeet(400))}. A 20-inch by 20-inch area is approximately ${formatArea(squareInchesToSquareFeet(400))} square feet.`,
  },
  {
    question: 'Are 12 Inches by 12 Inches Equal to One Square Foot?',
    answer: `Yes. An area measuring 12 inches long and 12 inches wide equals 12 × 12 = ${SQUARE_INCHES_PER_SQUARE_FOOT} in². Since ${SQUARE_INCHES_PER_SQUARE_FOOT} in² = 1 ft², a 12-inch by 12-inch square covers exactly one square foot.`,
  },
  {
    question: 'How Do I Convert Square Feet Back to Square Inches?',
    answer: `Multiply the square-foot measurement by ${SQUARE_INCHES_PER_SQUARE_FOOT}. Example: 5 × ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatArea(squareFeetToSquareInches(5))}. Therefore 5 square feet = ${formatArea(squareFeetToSquareInches(5))} square inches.`,
  },
  {
    question: 'Why Do We Divide Square Inches by 144?',
    answer: `Because one square foot contains ${SQUARE_INCHES_PER_SQUARE_FOOT} square inches. The factor comes from squaring the linear relationship of 12 inches per foot: 12² = ${SQUARE_INCHES_PER_SQUARE_FOOT}.`,
  },
  {
    question: 'Is a Square Inch the Same as an Inch?',
    answer:
      'No. An inch is a unit of length. A square inch is a unit of area. A square inch measures a two-dimensional surface, while an inch measures a one-dimensional distance.',
  },
];
