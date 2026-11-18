import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatArea,
  squareKilometersToSquareMiles,
  squareMilesToSquareKilometers,
  SQUARE_KILOMETERS_PER_SQUARE_MILE,
  SQUARE_MILES_PER_SQUARE_KILOMETER,
} from './calculation';

export const MI2_TO_KM2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Miles to Square km Converter' },
  { id: 'how-many', label: 'How Many Square Kilometers Are in a Square Mile?' },
  { id: 'how-to-km2', label: 'How to Convert Square km to Square Miles' },
  { id: 'conversion-table', label: 'Square Miles to Square Kilometers Conversion Table' },
  { id: 'related-tools', label: 'Other Area Conversion Tools' },
  { id: 'mi2-to-km2-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MI2 = [1, 2, 5, 10, 20, 25, 40, 50, 75, 100, 250, 500, 1_000] as const;

function tableKm2(mi2: number): string {
  return squareMilesToSquareKilometers(mi2).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export const MI2_TO_KM2_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Miles to Square km Converter',
    paragraphs: [
      'Convert land area measured in square miles into square kilometers and vice versa. Use it for geographic measurements, city and country areas, land surveys, environmental studies, regional planning, geography assignments, and property or land measurement.',
      'Enter an area in either field for an immediate equivalent. Expand Other Area Conversion Units for square meters, square feet, acres, hectares, and more.',
    ],
  },
  {
    id: 'how-many',
    title: 'How Many Square Kilometers Are in a Square Mile?',
    paragraphs: [
      'A square mile is the area of a square with sides measuring one mile. A square kilometer is the area of a square with sides measuring one kilometer.',
      `The exact conversion is 1 mi² = ${SQUARE_KILOMETERS_PER_SQUARE_MILE} km². For everyday use, 1 square mile ≈ 2.59 square kilometers.`,
      'The factor is squared because area is two-dimensional. Since 1 mile = 1.609344 kilometers, the area factor is 1.609344 × 1.609344 = 2.589988110336.',
      `Example — a region covers 25 square miles: 25 × ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareMilesToSquareKilometers(25))}. Therefore 25 mi² ≈ 64.75 km².`,
    ],
    formula: `1 mi = 1.609344 km\n1 mi² = (1.609344)² = ${SQUARE_KILOMETERS_PER_SQUARE_MILE} km²\n25 × ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareMilesToSquareKilometers(25))} km²`,
  },
  {
    id: 'how-to-km2',
    title: 'How to Convert Square km to Square Miles?',
    paragraphs: [
      `Formula: mi² = km² ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE}, or approximately mi² ≈ km² × ${formatArea(SQUARE_MILES_PER_SQUARE_KILOMETER)}.`,
      '1. Identify the area measured in square kilometers.',
      '2. Divide the value by 2.589988110336.',
      '3. Round the result to the required precision.',
      '4. Express the result in square miles.',
      `Example — convert 100 km²: 100 ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareKilometersToSquareMiles(100))}. Therefore 100 km² ≈ 38.61 mi².`,
    ],
    formula: `mi² = km² ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE}\nmi² ≈ km² × ${formatArea(SQUARE_MILES_PER_SQUARE_KILOMETER)}\n100 ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareKilometersToSquareMiles(100))}`,
  },
  {
    id: 'conversion-table',
    title: 'Square Miles to Square Kilometers Conversion Table',
    paragraphs: [
      'Common square-mile values with square-kilometer equivalents from the exact international-mile factor. Displayed decimals are rounded for readability; calculations use full precision.',
    ],
    tableHeaders: ['Square Miles (mi²)', 'Square Kilometers (km²)'],
    table: TABLE_MI2.map((mi2) => [mi2.toLocaleString('en-US'), tableKm2(mi2)]),
  },
  {
    id: 'related-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators area tools include the Area Converter, Square Feet Converter, Square Meter Converter, Square Feet to Acres Calculator, Square Inch to Square Foot Converter, Square Meters to Square Feet Converter, Acres to Square Feet Converter, Acres to Hectares Converter, Hectares to Acres Converter, Acres to Square Miles Calculator, and Square Kilometers to Acres Conversion. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const MI2_TO_KM2_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 40 Square Miles in km²?',
    answer: `Multiply 40 by the square-mile-to-square-kilometer conversion factor: 40 × ${SQUARE_KILOMETERS_PER_SQUARE_MILE} = ${formatArea(squareMilesToSquareKilometers(40))}. Therefore 40 square miles ≈ 103.60 km².`,
  },
  {
    question: 'How Big Is 30 Square km in Square Miles?',
    answer: `Divide 30 by ${SQUARE_KILOMETERS_PER_SQUARE_MILE}: 30 ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareKilometersToSquareMiles(30))}. Therefore 30 km² ≈ 11.58 square miles.`,
  },
  {
    question: 'How Much Is 4,000 Square km in Miles?',
    answer: `Because the measurement describes area, the result is in square miles rather than linear miles: 4000 ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareKilometersToSquareMiles(4000))}. Therefore 4,000 km² ≈ 1,544.41 mi².`,
  },
  {
    question: 'Is One Square Mile Equal to 2.59 Square Kilometers?',
    answer: `Approximately, yes. One square mile is exactly ${SQUARE_KILOMETERS_PER_SQUARE_MILE} square kilometers. Using 2.59 is suitable for general estimates, but precise calculations should use the full conversion factor.`,
  },
  {
    question: 'How Do I Convert Square Kilometers to Square Miles?',
    answer: `Divide the area in square kilometers by ${SQUARE_KILOMETERS_PER_SQUARE_MILE}. Example: 50 ÷ ${SQUARE_KILOMETERS_PER_SQUARE_MILE} ≈ ${formatArea(squareKilometersToSquareMiles(50))}. Therefore 50 km² ≈ 19.31 mi².`,
  },
  {
    question: 'What Is the Difference Between Miles and Square Miles?',
    answer:
      'A mile measures linear distance. A square mile measures two-dimensional area. Converting square miles into square kilometers requires squaring the linear conversion factor (1.609344² = 2.589988110336).',
  },
];
