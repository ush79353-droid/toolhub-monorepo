import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertArea, formatArea, SQUARE_METERS_PER_SQUARE_YARD } from './calculation';
import {
  SQUARE_FEET_PER_SQUARE_YARD,
  SQUARE_INCHES_PER_SQUARE_YARD,
  SQUARE_YARDS_PER_ACRE,
} from './types';

export const YD2_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Yard Converter' },
  { id: 'what-is', label: 'What Is a Square Yard?' },
  { id: 'symbol', label: 'What Is the Symbol for Square Yards?' },
  { id: 'how-to-convert', label: 'How Do I Convert Square Yards to Other Units?' },
  { id: 'conversion-table', label: 'Square Yard Conversion Table' },
  { id: 'related-tools', label: 'Other Useful Tools' },
  { id: 'yd2-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_YD2 = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1_000] as const;

function tableFt2(yd2: number): string {
  return convertArea(yd2, 'yd2', 'ft2').toLocaleString('en-US');
}

function tableM2(yd2: number): string {
  return convertArea(yd2, 'yd2', 'm2').toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function tableAcre(yd2: number): string {
  return convertArea(yd2, 'yd2', 'acre').toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
}

export const YD2_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Yard Converter',
    paragraphs: [
      'Convert square yards into square feet, square meters, acres, and other area units — or reverse from any supported field. Use it for land measurement, flooring, carpeting, landscaping, construction, property measurements, fabric and material area calculations, and imperial–metric area conversions.',
      'Enter an area in any field to calculate equivalents across all units. Expand Conversion for other units for inches, centimeters, millimeters, kilometers, miles, and hectares.',
    ],
  },
  {
    id: 'what-is',
    title: 'What Is a Square Yard?',
    paragraphs: [
      'A square yard is a unit of area representing a square with sides measuring one yard. A yard equals three feet, so 1 yd² = 3 ft × 3 ft = 9 ft².',
      `Using the international yard (1 yd = 0.9144 m), 1 yd² = (0.9144)² = ${SQUARE_METERS_PER_SQUARE_YARD} m².`,
      'Square yards are common in flooring estimates, landscaping coverage, carpeting orders, and property area descriptions in customary-unit regions.',
    ],
    formula: `1 yd = 3 ft\n1 yd² = 3 × 3 = ${SQUARE_FEET_PER_SQUARE_YARD} ft²\n1 yd² = ${SQUARE_METERS_PER_SQUARE_YARD} m²`,
  },
  {
    id: 'symbol',
    title: 'What Is the Symbol for Square Yards?',
    paragraphs: [
      'The standard symbol for square yards is yd². A square yard may also be written as sq yd, sq. yd., square yard, or square yards.',
      'The superscript 2 indicates a two-dimensional measurement of area. A yard (yd) measures length; a square yard (yd²) measures area.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Square Yards to Other Units?',
    paragraphs: [
      `Square yards to square feet: ft² = yd² × ${SQUARE_FEET_PER_SQUARE_YARD}. Example: 12 × 9 = 108, so 12 yd² = 108 ft².`,
      `Square yards to square meters: m² = yd² × ${SQUARE_METERS_PER_SQUARE_YARD}. Example: 10 × ${SQUARE_METERS_PER_SQUARE_YARD} = ${formatArea(convertArea(10, 'yd2', 'm2'))}, so 10 yd² ≈ 8.3613 m².`,
      `Square yards to acres: acres = yd² ÷ ${SQUARE_YARDS_PER_ACRE}. Example: 100 ÷ 4840 ≈ ${formatArea(convertArea(100, 'yd2', 'acre'))}, so 100 yd² ≈ 0.02066 acres.`,
      `Square yards to square inches: in² = yd² × ${SQUARE_INCHES_PER_SQUARE_YARD}. Example: 1 × 1296 = 1296, so 1 yd² = 1,296 in².`,
    ],
    formula: `ft² = yd² × ${SQUARE_FEET_PER_SQUARE_YARD}\nm² = yd² × ${SQUARE_METERS_PER_SQUARE_YARD}\nacres = yd² ÷ ${SQUARE_YARDS_PER_ACRE}\nin² = yd² × ${SQUARE_INCHES_PER_SQUARE_YARD}`,
  },
  {
    id: 'conversion-table',
    title: 'Square Yard Conversion Table',
    paragraphs: [
      'Common square-yard values with square-foot, square-meter, and acre equivalents from the same conversion engine. Displayed decimals are rounded for readability; calculations use full precision.',
    ],
    tableHeaders: [
      'Square Yards (yd²)',
      'Square Feet (ft²)',
      'Square Meters (m²)',
      'Acres',
    ],
    table: TABLE_YD2.map((yd2) => [
      yd2.toLocaleString('en-US'),
      tableFt2(yd2),
      tableM2(yd2),
      tableAcre(yd2),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Useful Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the Area Converter, Square Feet Converter, Square Feet to Acres Calculator, Square Inch to Square Foot Converter, Square Meter Converter, Square Meters to Square Feet Converter, Square Miles to Square km Converter, Acres to Square Feet Converter, Acres to Hectares Converter, Hectares to Acres Converter, Yards to Acres Calculator, and Square Centimeters to Square Millimeters Converter. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const YD2_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Square Feet to Square Yards?',
    answer: `Divide the area in square feet by ${SQUARE_FEET_PER_SQUARE_YARD}. Example: 90 ÷ 9 = 10. Therefore 90 ft² = 10 yd².`,
  },
  {
    question: 'How Do I Convert Square Yards to Square Feet?',
    answer: `Multiply the area in square yards by ${SQUARE_FEET_PER_SQUARE_YARD}. Example: 12 × 9 = 108. Therefore 12 yd² = 108 ft².`,
  },
  {
    question: 'How Do I Convert Between Square Yards and Square Meters?',
    answer: `One square yard equals exactly ${SQUARE_METERS_PER_SQUARE_YARD} square meters. To convert yd² to m², multiply by ${SQUARE_METERS_PER_SQUARE_YARD}. To convert m² to yd², divide by ${SQUARE_METERS_PER_SQUARE_YARD}. Example: 50 ÷ ${SQUARE_METERS_PER_SQUARE_YARD} ≈ ${formatArea(convertArea(50, 'm2', 'yd2'))}, so 50 m² ≈ 59.80 yd².`,
  },
  {
    question: 'How Many Square Yards Are in an Acre?',
    answer: `One acre contains exactly ${SQUARE_YARDS_PER_ACRE.toLocaleString('en-US')} square yards. 1 acre = ${SQUARE_YARDS_PER_ACRE} yd².`,
  },
  {
    question: 'How Many Square Feet Are in a Square Yard?',
    answer: `One square yard contains ${SQUARE_FEET_PER_SQUARE_YARD} square feet because one yard equals three feet and area uses two dimensions: 3 × 3 = 9.`,
  },
  {
    question: 'Is a Square Yard the Same as a Yard?',
    answer:
      'No. A yard measures length, while a square yard measures area. A square yard represents the area of a square with sides that are each one yard long.',
  },
];
