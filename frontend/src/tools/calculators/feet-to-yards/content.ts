import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { feetToYards, formatLength, yardsToFeet } from './calculation';
import { FEET_PER_YARD } from './types';

export const FEET_TO_YARDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'definition', label: 'Definition of Foot and Yard' },
  { id: 'feet-to-yards', label: 'Converting Feet to Yards' },
  { id: 'yards-to-feet', label: 'Converting Yards to Feet' },
  { id: 'conversion-table', label: 'Feet to Yards Conversion Table' },
  { id: 'how-to-use', label: 'Using This Feet to Yards Conversion Tool' },
  { id: 'related-tools', label: 'Other Relevant Converters' },
  { id: 'feet-to-yards-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FEET = [1, 3, 6, 9, 12, 15, 18, 21, 24, 30, 60, 90, 100, 300] as const;

export const FEET_TO_YARDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'definition',
    title: 'Definition of Foot and Yard',
    paragraphs: [
      'A foot is a unit of length in the US customary and imperial systems. One foot equals exactly 12 inches.',
      `A yard is another customary length unit. One yard equals exactly ${FEET_PER_YARD} feet (36 inches). Yards appear often in sports fields, fabric lengths, and short land measurements.`,
      'This converter changes feet into yards and yards into feet instantly using that exact 3:1 relationship.',
    ],
    formula: `1 yd = ${FEET_PER_YARD} ft = 36 in`,
  },
  {
    id: 'feet-to-yards',
    title: 'Converting Feet to Yards',
    paragraphs: [
      `Divide feet by ${FEET_PER_YARD} because each yard contains three feet.`,
      `Example; convert 24 feet: 24 ÷ ${FEET_PER_YARD} = ${formatLength(feetToYards(24))}. Therefore 24 feet = 8 yards.`,
      `Example; convert 45 feet: 45 ÷ ${FEET_PER_YARD} = ${formatLength(feetToYards(45))}. Therefore 45 feet = 15 yards.`,
    ],
    formula: `Yards = Feet ÷ ${FEET_PER_YARD}`,
  },
  {
    id: 'yards-to-feet',
    title: 'Converting Yards to Feet',
    paragraphs: [
      `Multiply yards by ${FEET_PER_YARD}.`,
      `Example; convert 22 yards: 22 × ${FEET_PER_YARD} = ${formatLength(yardsToFeet(22))}. Therefore 22 yards = 66 feet.`,
      `Example; convert 10 yards: 10 × ${FEET_PER_YARD} = ${formatLength(yardsToFeet(10))}. Therefore 10 yards = 30 feet.`,
    ],
    formula: `Feet = Yards × ${FEET_PER_YARD}`,
  },
  {
    id: 'conversion-table',
    title: 'Feet to Yards Conversion Table',
    paragraphs: [
      'Table values may round repeating thirds for display. The calculator uses the exact factor of 3 without intermediate rounding.',
    ],
    tableHeaders: ['Feet', 'Yards'],
    table: TABLE_FEET.map((ft) => [formatLength(ft), formatLength(feetToYards(ft))]),
  },
  {
    id: 'how-to-use',
    title: 'Using This Feet to Yards Conversion Tool',
    paragraphs: [
      '1. Enter the measurement in the Length in feet field.',
      '2. The converter automatically calculates the equivalent yards.',
      '3. To convert in reverse, enter a measurement in the Length in yards field.',
      '4. The equivalent feet value appears immediately.',
      '5. Use Clear All Changes to reset the inputs, or Reload Calculator for a full empty reset.',
      '6. Use Share Result to copy or share the current conversion.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Relevant Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Distance Converter, Feet Converter, Feet to Miles Converter, Meters to Feet Converter, and Feet to Inches Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const FEET_TO_YARDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Feet Are There in 10 Yards?',
    answer: `There are ${FEET_PER_YARD} feet in one yard. 10 × ${FEET_PER_YARD} = ${formatLength(yardsToFeet(10))}. Therefore 10 yards = 30 feet.`,
  },
  {
    question: 'What Is 6 Feet Equal to in Yards?',
    answer: `Divide feet by ${FEET_PER_YARD}. 6 ÷ ${FEET_PER_YARD} = ${formatLength(feetToYards(6))}. Therefore 6 feet = 2 yards.`,
  },
  {
    question: 'How Do I Convert Feet to Yards?',
    answer: `Divide the length in feet by ${FEET_PER_YARD}. Example: 36 ÷ ${FEET_PER_YARD} = ${formatLength(feetToYards(36))}, so 36 feet = 12 yards.`,
  },
  {
    question: 'How Many Yards Are in 100 Feet?',
    answer: `100 ÷ ${FEET_PER_YARD} ≈ ${formatLength(feetToYards(100))}. Therefore 100 feet ≈ ${formatLength(feetToYards(100))} yards.`,
  },
  {
    question: 'Is a Yard Longer Than a Foot?',
    answer: `Yes. A yard is three times as long as a foot: 1 yd = ${FEET_PER_YARD} ft.`,
  },
];
