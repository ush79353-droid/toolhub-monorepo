import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatForce,
  newtonsToPoundsForce,
  poundsForceToNewtons,
} from './calculation';
import { NEWTONS_PER_POUND_FORCE } from './types';

export const LBS_TO_NEWTONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-newton', label: 'What Is a Newton?' },
  { id: 'what-is-lbf', label: 'What Is Pound-force?' },
  { id: 'lbs-to-n', label: 'How to Convert Lbs to Newtons' },
  { id: 'n-to-lbs', label: 'How to Convert Newtons to Lbs' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'applications', label: 'Applications' },
  { id: 'mass-vs-force', label: 'Mass vs Force' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'lbs-to-newtons-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  left: string;
  right: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableHeaders?: readonly [string, string];
  tableNote?: string;
}

const TABLE_LBF = [0, 1, 2, 5, 10, 20, 25, 50, 75, 100, 200, 500, 1000] as const;

export const LBS_TO_NEWTONS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `The Lbs to Newtons Converter converts force between pound-force (lbf) and newtons (N). Enter a value in either field and the equivalent force updates immediately. Exact relationship: 1 lbf = ${formatForce(NEWTONS_PER_POUND_FORCE)} N.`,
      'In this tool, “lbs” means pounds-force, not pounds-mass. Mass and force are different physical quantities.',
    ],
  },
  {
    id: 'what-is-newton',
    title: 'What Is a Newton?',
    paragraphs: [
      'The newton (N) is the SI-derived unit of force. One newton is the force that accelerates one kilogram of mass at one meter per second squared.',
      'Newton’s second law states F = m × a. Example: a 2 kg mass accelerated at 3 m/s² experiences a force of 6 N.',
    ],
    formula: '1 N = 1 kg·m/s²   ·   F = m × a',
  },
  {
    id: 'what-is-lbf',
    title: 'What Is Pound-force (lbf)?',
    paragraphs: [
      'Pound-force is a force unit used in US customary and related engineering systems. One pound-force equals the standard gravitational force on one international pound-mass (0.45359237 kg × 9.80665 m/s²).',
      `That product is exact: 1 lbf = ${formatForce(NEWTONS_PER_POUND_FORCE)} N. Pound-mass (lb) is not the same quantity as pound-force (lbf).`,
    ],
    formula: `1 lbf = ${formatForce(NEWTONS_PER_POUND_FORCE)} N`,
  },
  {
    id: 'lbs-to-n',
    title: 'How to Convert Lbs to Newtons',
    paragraphs: [
      `Multiply pounds-force by ${formatForce(NEWTONS_PER_POUND_FORCE)}. Example: 50 lbf × ${formatForce(NEWTONS_PER_POUND_FORCE)} = ${formatForce(poundsForceToNewtons(50))} N.`,
    ],
    formula: `N = lbf × ${formatForce(NEWTONS_PER_POUND_FORCE)}`,
  },
  {
    id: 'n-to-lbs',
    title: 'How to Convert Newtons to Pounds-force',
    paragraphs: [
      `Divide newtons by ${formatForce(NEWTONS_PER_POUND_FORCE)}. Example: 100 N ÷ ${formatForce(NEWTONS_PER_POUND_FORCE)} ≈ ${formatForce(newtonsToPoundsForce(100))} lbf.`,
    ],
    formula: `lbf = N / ${formatForce(NEWTONS_PER_POUND_FORCE)}`,
  },
  {
    id: 'conversion-table',
    title: 'Conversion Table',
    paragraphs: [
      'Selected pound-force values converted with the exact constant. Displayed decimals are rounded for reading; the calculator keeps full internal precision.',
    ],
    tableHeaders: ['Pounds-force (lbf)', 'Newtons (N)'],
    table: TABLE_LBF.map((lbf) => ({
      left: formatForce(lbf),
      right: formatForce(poundsForceToNewtons(lbf)),
    })),
    tableNote: `Exact: 1 lbf = ${formatForce(NEWTONS_PER_POUND_FORCE)} N.`,
  },
  {
    id: 'applications',
    title: 'Applications of Force Conversion',
    paragraphs: [
      'Accurate lbf ↔ N conversion matters in mechanical and structural engineering, material testing, industrial machinery, automotive and aerospace loads, manufacturing, and laboratory physics work whenever datasets mix customary and SI force units.',
    ],
  },
  {
    id: 'mass-vs-force',
    title: 'Difference Between Mass and Force',
    paragraphs: [
      'Mass measures inertia (kilograms or pounds-mass). Force measures interaction (newtons or pounds-force). Weight force equals mass times gravitational acceleration, so converting mass to a force requires an assumed g.',
      'This converter does not convert pounds-mass to newtons. It converts pound-force to newtons and the reverse.',
    ],
    formula: 'Weight force = mass × gravitational acceleration',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      '1. Enter force in pounds-force (lbf) and read newtons, or enter newtons and read pounds-force.',
      '2. Both fields are editable; the last-edited field is the source.',
      '3. Copy or share the result, or clear all changes to reset.',
    ],
  },
];

export const LBS_TO_NEWTONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert lbs to newtons?',
    answer: `Multiply pound-force by ${formatForce(NEWTONS_PER_POUND_FORCE)}.`,
  },
  {
    question: 'How many newtons are in one pound-force?',
    answer: `Exactly ${formatForce(NEWTONS_PER_POUND_FORCE)} N.`,
  },
  {
    question: 'How many newtons are equivalent to 10 lbf?',
    answer: `Exactly ${formatForce(poundsForceToNewtons(10))} N.`,
  },
  {
    question: 'How many newtons are equivalent to 50 lbf?',
    answer: `Exactly ${formatForce(poundsForceToNewtons(50))} N.`,
  },
  {
    question: 'How many newtons are equivalent to 100 lbf?',
    answer: `Exactly ${formatForce(poundsForceToNewtons(100))} N.`,
  },
  {
    question: 'How do I convert newtons to lbf?',
    answer: `Divide newtons by ${formatForce(NEWTONS_PER_POUND_FORCE)}.`,
  },
  {
    question: 'How many pounds-force are in one newton?',
    answer: `Approximately ${formatForce(newtonsToPoundsForce(1))} lbf.`,
  },
  {
    question: 'How many pounds-force are in 100 newtons?',
    answer: `Approximately ${formatForce(newtonsToPoundsForce(100))} lbf.`,
  },
  {
    question: 'Which unit is used for force in scientific and engineering fields?',
    answer: 'The newton (N) is the SI-derived unit of force.',
  },
  {
    question: 'What is the difference between lbs and lbf?',
    answer:
      'In precise writing, lb usually means pound-mass, while lbf means pound-force. This converter treats “lbs” as pound-force.',
  },
  {
    question: 'Is one pound-force equal to one pound-mass?',
    answer:
      'No. Pound-force is force; pound-mass is mass. They are numerically related only under a stated gravity.',
  },
  {
    question: 'Can force be negative?',
    answer:
      'Yes. A signed force component may be negative depending on the chosen coordinate direction. This converter preserves the sign.',
  },
  {
    question: "What is Newton's second law?",
    answer: 'F = m × a — force equals mass multiplied by acceleration.',
  },
];
