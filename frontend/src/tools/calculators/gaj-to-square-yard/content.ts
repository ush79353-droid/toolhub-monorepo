import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMeasure,
  gajToSquareFeet,
  gajToSquareYards,
  squareFeetToGaj,
  squareMetersToGaj,
} from './calculation';
import { SQUARE_FEET_PER_SQUARE_YARD, SQUARE_YARDS_PER_LAND_GAJ } from './types';

export const GAJ_TO_SQ_YD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'one-square-yard', label: '1 Square Yard Is Equal to How Many Gaj?' },
  { id: 'how-to-convert', label: 'How to Convert from Gaj to Square Yards?' },
  { id: 'related-tools', label: 'Our Other Area Converters' },
  { id: 'gaj-to-sq-yd-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_GAJ = [1, 5, 10, 50, 100, 150, 200, 500, 1000] as const;

export const GAJ_TO_SQ_YD_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'one-square-yard',
    title: '1 Square Yard Is Equal to How Many Gaj?',
    paragraphs: [
      'In common South Asian property terminology, land-area gaj (also spelled gaz) equals one square yard. Property listings in India, Pakistan, and nearby markets often quote plot size in gaj when they mean square yards of area.',
      `Therefore 1 square yard = ${SQUARE_YARDS_PER_LAND_GAJ} land-area gaj, and 1 land-area gaj = ${SQUARE_YARDS_PER_LAND_GAJ} square yard.`,
      `Because 1 square yard equals exactly ${SQUARE_FEET_PER_SQUARE_YARD} square feet, 1 gaj also equals ${SQUARE_FEET_PER_SQUARE_YARD} square feet. Examples: 100 gaj = 100 yd² = ${formatMeasure(gajToSquareFeet(100))} ft²; 150 gaj = 150 yd².`,
      'The word gaj can also mean a linear yard in traditional usage. A length cannot be converted into an area without more dimensions. This converter’s primary fields treat gaj as land area; the optional length section converts linear gaj to yards separately.',
    ],
    formula: `1 land-area gaj = 1 yd² = ${SQUARE_FEET_PER_SQUARE_YARD} ft²`,
    tableHeaders: ['Gaj', 'Square yards', 'Square feet'],
    table: TABLE_GAJ.map((g) => [
      formatMeasure(g),
      formatMeasure(gajToSquareYards(g)),
      formatMeasure(gajToSquareFeet(g)),
    ]),
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert from Gaj to Square Yards?',
    paragraphs: [
      `For land-area measurements: Square yards = Gaj × ${SQUARE_YARDS_PER_LAND_GAJ}. The reverse is Gaj = Square yards ÷ ${SQUARE_YARDS_PER_LAND_GAJ}.`,
      `Example 1: convert 150 gaj: 150 × ${SQUARE_YARDS_PER_LAND_GAJ} = ${formatMeasure(gajToSquareYards(150))} yd².`,
      `Example 2: convert 250 gaj: 250 × ${SQUARE_YARDS_PER_LAND_GAJ} = ${formatMeasure(gajToSquareYards(250))} yd².`,
      `Example 3: convert 100 gaj to square feet: 100 × ${SQUARE_FEET_PER_SQUARE_YARD} = ${formatMeasure(gajToSquareFeet(100))} ft². Do not multiply by 9 when converting to square yards; that factor is only for square feet.`,
    ],
    formula: `yd² = gaj × ${SQUARE_YARDS_PER_LAND_GAJ} · ft² = gaj × ${SQUARE_FEET_PER_SQUARE_YARD}`,
  },
  {
    id: 'related-tools',
    title: 'Our Other Area Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Area Converter, Acres to Square Feet Converter, Square Kilometers to Acres Conversion, Cent to Square Meter Converter, Yards to Acres Calculator, Acre to Are Conversion, and Acreage Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAJ_TO_SQ_YD_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 150 Square Yards in Gaj?',
    answer:
      'Because 1 square yard equals 1 land-area gaj: 150 square yards = 150 gaj.',
  },
  {
    question: 'How Much Is 1,000 Square Meters in Gaj?',
    answer: `Using 1 yd² = 0.83612736 m²: 1,000 ÷ 0.83612736 ≈ ${formatMeasure(squareMetersToGaj(1000))} gaj. Therefore 1,000 square meters is approximately 1,195.99 gaj.`,
  },
  {
    question: 'How Much Is 220 Square Feet in Gaj?',
    answer: `Since 1 gaj = ${SQUARE_FEET_PER_SQUARE_YARD} square feet: 220 ÷ ${SQUARE_FEET_PER_SQUARE_YARD} ≈ ${formatMeasure(squareFeetToGaj(220))} gaj. Therefore 220 square feet is approximately 24.44 gaj.`,
  },
  {
    question: 'How Do I Convert 3,000 Square Feet to Gaj?',
    answer: `Divide square feet by ${SQUARE_FEET_PER_SQUARE_YARD}: 3000 ÷ ${SQUARE_FEET_PER_SQUARE_YARD} ≈ ${formatMeasure(squareFeetToGaj(3000))} gaj. Therefore 3,000 square feet is approximately 333.33 gaj.`,
  },
  {
    question: 'How Much Is 200 Gaj in Square Feet?',
    answer: `Multiply by ${SQUARE_FEET_PER_SQUARE_YARD}: 200 × ${SQUARE_FEET_PER_SQUARE_YARD} = ${formatMeasure(gajToSquareFeet(200))}. Therefore 200 gaj = 1,800 square feet.`,
  },
];
