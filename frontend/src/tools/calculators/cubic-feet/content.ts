import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure } from './calculation';
import {
  CUBIC_FEET_PER_CUBIC_YARD,
  CUBIC_INCHES_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_CUBIC_FOOT,
} from './types';

export const CUBIC_FEET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-cubic-foot', label: 'What Is a Cubic Foot?' },
  { id: 'how-to-calculate', label: 'How to Calculate Cubic Feet' },
  { id: 'from-inches', label: 'How to Calculate Cubic Feet from Inches' },
  { id: 'from-centimeters', label: 'How to Calculate Cubic Feet from Centimeters' },
  { id: 'soil-volume', label: 'How to Calculate Cubic Feet of Soil' },
  { id: 'to-cubic-yards', label: 'Cubic Feet to Cubic Yards' },
  { id: 'to-cubic-meters', label: 'Cubic Feet to Cubic Meters' },
  { id: 'conversion-table', label: 'Cubic Feet Conversion Table' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'ft2-vs-ft3', label: 'Difference Between Cubic Feet and Square Feet' },
  { id: 'cubic-feet-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  cubicFeet: string;
  cubicInches: string;
  cubicYards: string;
}

export interface CubicFeetGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_FT3 = [1, 2, 5, 10, 27, 50, 100] as const;

export const CUBIC_FEET_GUIDE_SECTIONS: readonly CubicFeetGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator finds the volume of a rectangular object or space from length, width, and height, reporting the result in cubic feet (ft³). Each edge can use its own length unit.',
      'Cubic feet measure volume—three-dimensional space—not area. Square feet alone cannot produce cubic feet without a third dimension such as height or depth.',
    ],
  },
  {
    id: 'what-is-a-cubic-foot',
    title: 'What Is a Cubic Foot?',
    paragraphs: [
      `A cubic foot is a volume unit with symbol ft³. It is the volume of a cube measuring one foot on each edge. One cubic foot equals exactly ${CUBIC_INCHES_PER_CUBIC_FOOT} cubic inches and exactly ${CUBIC_METERS_PER_CUBIC_FOOT} cubic meters.`,
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Cubic Feet',
    paragraphs: [
      'Express length, width, and height in feet (or let the calculator convert them), then multiply. Example: 6 ft × 4 ft × 3 ft = 72 ft³.',
    ],
    formula: 'Volume (ft³) = Length (ft) × Width (ft) × Height (ft)',
  },
  {
    id: 'from-inches',
    title: 'How to Calculate Cubic Feet from Inches',
    paragraphs: [
      'Multiply the three dimensions in inches to get cubic inches, then divide by 1728. Example: 36 in × 18 in × 24 in = 15,552 in³ → 15,552 ÷ 1728 = 9 ft³.',
    ],
    formula: 'Cubic feet = Length(in) × Width(in) × Height(in) / 1728',
  },
  {
    id: 'from-centimeters',
    title: 'How to Calculate Cubic Feet from Centimeters',
    paragraphs: [
      'Convert centimeters to meters (divide by 100), multiply to get cubic meters, then divide by 0.028316846592 to get cubic feet. The calculator does this automatically when you select cm for each edge.',
    ],
    formula: 'ft³ = (L_cm × W_cm × H_cm / 1,000,000) / 0.028316846592',
  },
  {
    id: 'soil-volume',
    title: 'How to Calculate Cubic Feet of Soil',
    paragraphs: [
      'For a rectangular bed with uniform depth, volume = length × width × depth using consistent units. Example: 12 ft × 8 ft × 0.5 ft = 48 ft³ ≈ 1.7778 yd³ (48 ÷ 27). This assumes a flat rectangle of constant depth and does not estimate soil weight.',
    ],
    formula: 'Soil volume = Length × Width × Depth',
  },
  {
    id: 'to-cubic-yards',
    title: 'Cubic Feet to Cubic Yards',
    paragraphs: [
      `Divide cubic feet by ${CUBIC_FEET_PER_CUBIC_YARD}. Example: 54 ft³ ÷ 27 = 2 yd³.`,
    ],
    formula: 'Cubic yards = Cubic feet / 27',
  },
  {
    id: 'to-cubic-meters',
    title: 'Cubic Feet to Cubic Meters',
    paragraphs: [
      `Multiply cubic feet by ${CUBIC_METERS_PER_CUBIC_FOOT}. Example: 10 ft³ = 0.28316846592 m³.`,
    ],
    formula: 'Cubic meters = Cubic feet × 0.028316846592',
  },
  {
    id: 'conversion-table',
    title: 'Cubic Feet Conversion Table',
    paragraphs: [
      'Common cubic-foot values with exact cubic inches and cubic yards from the same constants used by the calculator.',
    ],
    table: TABLE_FT3.map((ft3) => ({
      cubicFeet: formatMeasure(ft3),
      cubicInches: formatMeasure(ft3 * CUBIC_INCHES_PER_CUBIC_FOOT),
      cubicYards: formatMeasure(ft3 / CUBIC_FEET_PER_CUBIC_YARD),
    })),
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use cubic feet for shipping boxes, packaging, storage, construction takeoffs, landscaping fill, excavation, room volumes, furniture clearance, and material-volume estimates.',
      'Results assume a rectangular prism. Irregular shapes need different geometry.',
    ],
  },
  {
    id: 'ft2-vs-ft3',
    title: 'Difference Between Cubic Feet and Square Feet',
    paragraphs: [
      'Square feet (ft²) measure area from two dimensions. Cubic feet (ft³) measure volume from three. You cannot convert area into volume without a height or depth.',
    ],
  },
];

export const CUBIC_FEET_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a cubic foot?',
    answer: 'A cubic foot is the volume of a cube measuring one foot along each edge.',
  },
  {
    question: 'How do I calculate cubic feet?',
    answer:
      'Multiply length, width, and height after expressing all three dimensions in feet (or converting them first).',
  },
  {
    question: 'What is the volume of a 5 ft × 5 ft × 5 ft cube?',
    answer: '5 × 5 × 5 = 125 ft³.',
  },
  {
    question: 'How do I calculate cubic feet from inches?',
    answer: 'Multiply the dimensions in inches, then divide by 1728.',
  },
  {
    question: 'How many cubic inches are in one cubic foot?',
    answer: 'Exactly 1728 cubic inches.',
  },
  {
    question: 'How many cubic feet are in one cubic yard?',
    answer: 'Exactly 27 cubic feet.',
  },
  {
    question: 'How many cubic feet are in one cubic meter?',
    answer: `Approximately ${formatMeasure(1 / CUBIC_METERS_PER_CUBIC_FOOT)} cubic feet.`,
  },
  {
    question: 'How do I calculate cubic feet from centimeters?',
    answer:
      'Convert centimeters to meters, calculate cubic meters, and convert the result to cubic feet using 0.028316846592 m³ per ft³.',
  },
  {
    question: 'How much is 1 ft × 1 ft × 1 ft in cubic feet?',
    answer: 'Exactly 1 cubic foot.',
  },
  {
    question: 'How do I calculate cubic feet of soil?',
    answer:
      'Multiply the length, width, and depth of the soil space using consistent units (or mixed units via this calculator).',
  },
  {
    question: 'Can I calculate cubic feet using different dimension units?',
    answer:
      'Yes. The calculator converts each dimension to meters before multiplying, then reports cubic feet.',
  },
  {
    question: 'Can I calculate cubic feet from square feet?',
    answer: 'Only if the relevant height or depth is also known.',
  },
  {
    question: 'How many cubic feet are in 54 cubic yards?',
    answer: '54 × 27 = 1458 ft³.',
  },
  {
    question: 'What is the difference between cubic feet and cubic meters?',
    answer: `Both measure volume. One cubic foot equals exactly ${CUBIC_METERS_PER_CUBIC_FOOT} cubic meters.`,
  },
];
