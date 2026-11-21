import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANGLE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-an-angle', label: 'What Is an Angle? Acute, Obtuse, and Other Angles' },
  { id: 'radians', label: 'What Is a Radian and How to Convert Degrees to Radians?' },
  { id: 'dms', label: 'How to Convert Degrees, Minutes, and Seconds to Decimal Degrees' },
  { id: 'other-units', label: 'Other Angle Units' },
  { id: 'how-to-use', label: 'How to Use the Angle Conversion Calculator' },
  { id: 'reference-table', label: 'Angle Conversion Reference Table' },
  { id: 'angle-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const ANGLE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-an-angle',
    title: 'What Is an Angle? Acute, Obtuse, and Other Angles',
    paragraphs: [
      'An angle is formed by two rays that share a common endpoint called the vertex. Angles measure how far one direction has rotated relative to another. Degrees and radians are the most common units; gradians, turns, and DMS appear in surveying and engineering.',
      'Angles may be negative (often clockwise under the mathematical convention) or larger than one full revolution.',
    ],
    tableHeaders: ['Angle type', 'Measurement'],
    table: [
      ['Zero angle', '0°'],
      ['Acute angle', 'Greater than 0° and less than 90°'],
      ['Right angle', '90°'],
      ['Obtuse angle', 'Greater than 90° and less than 180°'],
      ['Straight angle', '180°'],
      ['Reflex angle', 'Greater than 180° and less than 360°'],
      ['Full turn', '360°'],
    ],
  },
  {
    id: 'radians',
    title: 'What Is a Radian and How to Convert Degrees to Radians?',
    paragraphs: [
      'A radian measures an angle by relating arc length to radius: one radian is the central angle subtended by an arc whose length equals the radius. A full circle is 2π radians, a half-circle is π, and a quarter-circle is π/2.',
      'Convert degrees to radians by multiplying by π/180. Convert radians to degrees by multiplying by 180/π. This calculator uses Math.PI for those factors and does not shorten π during intermediate work.',
    ],
    formula: 'θ_rad = θ_deg × π/180 · θ_deg = θ_rad × 180/π',
    tableHeaders: ['Degrees', 'Radians'],
    table: [
      ['0°', '0'],
      ['30°', 'π/6'],
      ['45°', 'π/4'],
      ['60°', 'π/3'],
      ['90°', 'π/2'],
      ['120°', '2π/3'],
      ['180°', 'π'],
      ['270°', '3π/2'],
      ['360°', '2π'],
    ],
  },
  {
    id: 'dms',
    title: 'How to Convert Degrees, Minutes, and Seconds to Decimal Degrees',
    paragraphs: [
      'Sexagesimal DMS divides each degree into 60 arcminutes and each arcminute into 60 arcseconds, so 1° = 60′ = 3,600″. For nonnegative component magnitudes: D_decimal = D + M/60 + S/3600. Apply the overall sign to the complete expression; −0° 30′ is −0.5°, not −29.75° from a broken sign on whole degrees alone.',
      'Example: 40° 25′ 30″ → 25/60 = 0.4166667, 30/3600 = 0.0083333, total 40.425°.',
    ],
    formula: '1° = 60′ = 3,600″ · D_decimal = sign × (|D| + M/60 + S/3600)',
  },
  {
    id: 'other-units',
    title: 'Other Angle Units',
    paragraphs: [
      'Gradians (gons) divide a full circle into 400 parts (100 gon = 90°). Turns measure whole revolutions (0.25 turn = 90°). π-radian fields store a multiple of π (0.5 π rad = π/2 rad = 90°). Arcminutes and arcseconds refine degrees. Microradians are 10⁻⁶ rad. Angular mils depend on convention: NATO 6,400 per turn, Soviet 6,000, Swedish 6,300; they are not interchangeable.',
    ],
    formula: '360° = 2π rad = 400 gon = 1 turn',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Angle Conversion Calculator',
    paragraphs: [
      '1. Enter a value in any primary field (degrees, radians, gradians, turns, or π radians).',
      '2. Or fill degrees, minutes, and seconds in the DMS row (sign on the degrees box).',
      '3. Read the synchronized conversions.',
      '4. Expand More angle units for arcminutes, arcseconds, microradians, and mil systems.',
      '5. Share or copy the result, or use Reload / Clear to reset.',
    ],
  },
  {
    id: 'reference-table',
    title: 'Angle Conversion Reference Table',
    paragraphs: ['Common exact and decimal equivalents:'],
    tableHeaders: ['Degrees', 'Radians', 'Gradians', 'Turns'],
    table: [
      ['0', '0', '0', '0'],
      ['30', 'π/6', '33.333333', '0.083333'],
      ['45', 'π/4', '50', '0.125'],
      ['60', 'π/3', '66.666667', '0.166667'],
      ['90', 'π/2', '100', '0.25'],
      ['120', '2π/3', '133.333333', '0.333333'],
      ['180', 'π', '200', '0.5'],
      ['270', '3π/2', '300', '0.75'],
      ['360', '2π', '400', '1'],
    ],
  },
];

export const ANGLE_FAQS: readonly FAQItem[] = [
  {
    question: 'How many radians are in 180 degrees?',
    answer: 'There are π radians in 180 degrees. 180° = π rad.',
  },
  {
    question: 'How do I convert degrees to radians?',
    answer: 'Multiply by π/180. Example: 90° × π/180 = π/2.',
  },
  {
    question: 'How do I convert radians to degrees?',
    answer: 'Multiply by 180/π. Example: π rad = 180°.',
  },
  {
    question: 'How many degrees are in one radian?',
    answer: 'One radian is approximately 57.2957795 degrees.',
  },
  {
    question: 'What is one gradian in degrees?',
    answer: 'One gradian equals 0.9 degrees.',
  },
  {
    question: 'How many gradians are in a full circle?',
    answer: 'A full circle contains 400 gradians.',
  },
  {
    question: 'How many turns are in 90 degrees?',
    answer: '90 degrees is one-quarter turn. 90/360 = 0.25.',
  },
  {
    question: 'What is the difference between degrees and radians?',
    answer:
      'Degrees divide a full revolution into 360 equal parts. Radians measure the angle as the ratio of arc length to radius.',
  },
  {
    question: 'How do I convert degrees, minutes, and seconds to decimal degrees?',
    answer: 'Use D + M/60 + S/3600 for magnitudes, then apply the sign to the whole angle.',
  },
  {
    question: 'Can angles be greater than 360 degrees?',
    answer: 'Yes. Values above 360° represent more than one full revolution (for example 720° = 2 turns).',
  },
  {
    question: 'Can an angle be negative?',
    answer:
      'Yes. Negative angles commonly represent rotation in the clockwise direction under the standard mathematical convention.',
  },
  {
    question: 'How many arcseconds are in one degree?',
    answer: 'One degree contains 3,600 arcseconds.',
  },
];
