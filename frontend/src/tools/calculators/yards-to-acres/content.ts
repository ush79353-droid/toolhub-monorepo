import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatArea, squareYardsToAcres } from './calculation';
import { SQUARE_YARDS_PER_ACRE } from './types';

export const YARDS_TO_ACRES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-yd2', label: 'What Is a Square Yard?' },
  { id: 'what-is-an-acre', label: 'What Is an Acre?' },
  { id: 'relationship', label: 'Square Yards and Acres' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'yd2-to-acres', label: 'Yards to Acres Equation' },
  { id: 'acres-to-yd2', label: 'Acres to Square Yards Equation' },
  { id: 'conversion-table', label: 'Square Yards to Acres Conversion Table' },
  { id: 'practical-applications', label: 'Applications of the Calculator' },
  { id: 'yards-vs-square-yards', label: 'Difference Between Yards and Square Yards' },
  { id: 'yards-to-acres-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  squareYards: string;
  acres: string;
}

export interface YardsToAcresGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_YD2 = [
  100, 500, 1000, 1210, 2420, 4840, 9680, 14520, 24200, 48400, 96800, 242000, 484000,
] as const;

export const YARDS_TO_ACRES_GUIDE_SECTIONS: readonly YardsToAcresGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator converts land area between square yards (yd²) and acres (ac). Enter either unit and read the matching value instantly.',
      'A yard (yd) measures length. A square yard (yd²) measures area. Only square yards convert directly to acres—linear yards need a second dimension first.',
    ],
  },
  {
    id: 'what-is-yd2',
    title: 'What Is a Square Yard?',
    paragraphs: [
      'A square yard is an area unit with symbol yd². A square one yard on each side has an area of one square yard. One square yard equals exactly 9 square feet and exactly 0.83612736 square meters.',
    ],
  },
  {
    id: 'what-is-an-acre',
    title: 'What Is an Acre?',
    paragraphs: [
      'An acre is a land-area unit with symbol ac. One international acre equals exactly 4840 square yards, exactly 43,560 square feet, and exactly 4046.8564224 square meters.',
    ],
  },
  {
    id: 'relationship',
    title: 'Square Yards and Acres',
    paragraphs: [
      `Because one acre is defined as ${SQUARE_YARDS_PER_ACRE} square yards, converting between the units is a simple exact scale factor with no approximation in the arithmetic.`,
    ],
    formula: '1 acre = 4840 yd²',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Enter an area in square yards to fill acres, or enter acres to fill square yards. Open More conversion options for square feet, square meters, square kilometers, hectares, and ares. Copy result places a short summary on the clipboard; Reset clears both fields.',
    ],
  },
  {
    id: 'yd2-to-acres',
    title: 'Yards to Acres Equation',
    paragraphs: [
      'Divide square yards by 4840. Example: 14,520 yd² ÷ 4840 = 3 acres.',
    ],
    formula: 'acres = square yards / 4840',
  },
  {
    id: 'acres-to-yd2',
    title: 'Acres to Square Yards Equation',
    paragraphs: [
      'Multiply acres by 4840. Example: 3 acres × 4840 = 14,520 yd².',
    ],
    formula: 'square yards = acres × 4840',
  },
  {
    id: 'conversion-table',
    title: 'Square Yards to Acres Conversion Table',
    paragraphs: [
      'Common values below use the same engine as the calculator. Exact multiples of 4840 land on whole acres.',
    ],
    table: TABLE_YD2.map((yd2) => ({
      squareYards: formatArea(yd2),
      acres: formatArea(squareYardsToAcres(yd2)),
    })),
  },
  {
    id: 'practical-applications',
    title: 'Applications of the Calculator',
    paragraphs: [
      'Use the converter for real estate listings, agricultural parcels, property planning, landscape design, construction takeoffs, land surveying notes, land investment comparisons, and everyday property-size checks.',
      'This page only converts a known area. It does not survey irregular plots or replace legal land records.',
    ],
  },
  {
    id: 'yards-vs-square-yards',
    title: 'Difference Between Yards and Square Yards',
    paragraphs: [
      'Yard (yd) is one-dimensional length. Square yard (yd²) is two-dimensional area. Acre (ac) is also area. Converting linear yards to acres requires length and width (or another area formula)—for rectangular land, area in yd² = length(yd) × width(yd), then acres = yd² ÷ 4840. Prefer the dedicated Acreage Calculator when you start from length and width.',
    ],
  },
];

export const YARDS_TO_ACRES_FAQS: readonly FAQItem[] = [
  {
    question: 'Is a square yard the same as a yard?',
    answer: 'No. A yard measures length, while a square yard measures area.',
  },
  {
    question: 'How do I convert square yards to acres?',
    answer: 'Divide the square-yard measurement by 4840.',
  },
  {
    question: 'How many square yards are in one acre?',
    answer: 'Exactly 4840 square yards.',
  },
  {
    question: 'How many acres are in 4840 square yards?',
    answer: 'Exactly 1 acre.',
  },
  {
    question: 'How many square yards are in 3 acres?',
    answer: '3 × 4840 = 14,520 yd².',
  },
  {
    question: 'How many acres are in 10000 square yards?',
    answer: '10,000 ÷ 4840 ≈ 2.06611570248 acres.',
  },
  {
    question: 'How many square yards are in 10 acres?',
    answer: '10 × 4840 = 48,400 yd².',
  },
  {
    question: 'How many square feet are in one acre?',
    answer: 'Exactly 43,560 square feet.',
  },
  {
    question: 'How many square meters are in one acre?',
    answer: 'Exactly 4046.8564224 square meters.',
  },
  {
    question: 'Can I calculate acres from length and width in yards?',
    answer:
      'Yes, for a rectangular plot: multiply length by width to get square yards, then divide by 4840. The Acreage Calculator is built for that workflow.',
  },
  {
    question: 'Can I convert linear yards directly to acres?',
    answer:
      'No. Linear yards measure length, while acres measure area. You need a second dimension or an area value.',
  },
  {
    question: 'Why are acres used instead of square yards?',
    answer:
      'Acres are commonly used for larger land parcels, while square yards suit smaller areas and detailed property measurements.',
  },
];
