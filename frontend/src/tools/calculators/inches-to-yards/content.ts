import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, inchesToYards, yardsToInches } from './calculation';
import { INCHES_PER_YARD } from './types';

export const INCHES_TO_YARDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Inches to Yard Conversion' },
  { id: 'inches-to-yards', label: 'How Do I Convert Inches Into Yards?' },
  { id: 'examples', label: 'Inches to Yard Conversion Examples' },
  { id: 'yards-to-inches', label: 'How to Convert Yards Back to Inches' },
  { id: 'conversion-table', label: 'Inches to Yards Conversion Table' },
  { id: 'related-tools', label: 'Other Length-Related Converters' },
  { id: 'inches-to-yards-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_INCHES = [1, 6, 12, 18, 24, 36, 48, 72, 100, 108, 180, 360] as const;

export const INCHES_TO_YARDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Inches to Yard Conversion',
    paragraphs: [
      'Use this converter to change inches into yards, or yards back into inches, without flipping between formulas. Both fields stay editable so you can work in whichever unit you measured first.',
      'The relationship is fixed: one yard equals exactly 36 inches. That makes fabric cuts, garden beds, lumber lists, and sports-field markings easy to translate between inch tape readings and yard-based plans.',
      'Enter a value in either field and the other updates immediately using the exact 36:1 factor. Signed values are allowed when you are tracking differences rather than absolute lengths.',
    ],
    formula: `1 yd = ${INCHES_PER_YARD} in`,
  },
  {
    id: 'inches-to-yards',
    title: 'How Do I Convert Inches Into Yards?',
    paragraphs: [
      `One yard is defined as exactly ${INCHES_PER_YARD} inches. To convert inches to yards, divide the inch measurement by ${INCHES_PER_YARD}.`,
      `Example; convert 144 inches into yards: 144 ÷ ${INCHES_PER_YARD} = ${formatLength(inchesToYards(144))}. Therefore 144 inches = 4 yards.`,
      'Dividing by 36 yields the equivalent length in yards with no intermediate rounding in the calculator engine.',
    ],
    formula: `yd = in ÷ ${INCHES_PER_YARD}`,
  },
  {
    id: 'examples',
    title: 'Inches to Yard Conversion Examples',
    paragraphs: [
      `Example 1: convert 90 inches into yards: 90 ÷ ${INCHES_PER_YARD} = ${formatLength(inchesToYards(90))}. Therefore 90 inches = 2.5 yards.`,
      `Example 2: convert 180 inches into yards: 180 ÷ ${INCHES_PER_YARD} = ${formatLength(inchesToYards(180))}. Therefore 180 inches = 5 yards.`,
      `Example 3: convert 250 inches into yards: 250 ÷ ${INCHES_PER_YARD} ≈ ${formatLength(inchesToYards(250))}. Therefore 250 inches ≈ ${formatLength(inchesToYards(250))} yards.`,
    ],
  },
  {
    id: 'yards-to-inches',
    title: 'How to Convert Yards Back to Inches',
    paragraphs: [
      `Multiply yards by ${INCHES_PER_YARD} to recover inches.`,
      `Example; convert 7 yards: 7 × ${INCHES_PER_YARD} = ${formatLength(yardsToInches(7))}. Therefore 7 yards = 252 inches.`,
      'Use the yards field in this tool for reverse conversion; the inches field updates automatically.',
    ],
    formula: `in = yd × ${INCHES_PER_YARD}`,
  },
  {
    id: 'conversion-table',
    title: 'Inches to Yards Conversion Table',
    paragraphs: [
      'Common inch values and their yard equivalents. Display may round repeating decimals for readability; the live calculator keeps the exact ÷36 result.',
    ],
    tableHeaders: ['Inches', 'Yards'],
    table: TABLE_INCHES.map((inches) => [
      formatLength(inches),
      formatLength(inchesToYards(inches)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Length-Related Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Inch Converter, Feet to Yards Conversion, Yard Converter, Length Converter, Distance Converter, Feet Converter, Feet to Miles Converter, Metric to Inches, Height Converter, and Inches to Feet Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const INCHES_TO_YARDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 100 Inches to Yards?',
    answer: `Divide 100 by ${INCHES_PER_YARD}. 100 ÷ ${INCHES_PER_YARD} ≈ ${formatLength(inchesToYards(100))}. Therefore 100 inches is approximately ${formatLength(inchesToYards(100))} yards.`,
  },
  {
    question: 'How Many Inches Are in 1 Yard?',
    answer: `There are exactly ${INCHES_PER_YARD} inches in one yard.`,
  },
  {
    question: 'How Many Yards Are in 72 Inches?',
    answer: `72 ÷ ${INCHES_PER_YARD} = ${formatLength(inchesToYards(72))}. Therefore 72 inches equals 2 yards.`,
  },
  {
    question: 'How Many Yards Are in 180 Inches?',
    answer: `180 ÷ ${INCHES_PER_YARD} = ${formatLength(inchesToYards(180))}. Therefore 180 inches equals 5 yards.`,
  },
  {
    question: 'How Many Inches Are in 5 Yards?',
    answer: `5 × ${INCHES_PER_YARD} = ${formatLength(yardsToInches(5))}. Five yards equals 180 inches.`,
  },
  {
    question: 'Is 36 Inches Equal to 1 Yard?',
    answer: `Yes. One yard is defined as exactly ${INCHES_PER_YARD} inches.`,
  },
  {
    question: 'How Do I Convert Yards to Inches?',
    answer: `Multiply the yard measurement by ${INCHES_PER_YARD}. For example, 8 yards equals ${formatLength(yardsToInches(8))} inches.`,
  },
];
