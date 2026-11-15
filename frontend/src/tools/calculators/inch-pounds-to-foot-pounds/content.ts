import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  footPoundsToInchPounds,
  formatTorque,
  inchPoundsToFootPounds,
} from './calculation';
import { INCH_POUNDS_PER_FOOT_POUND } from './types';

export const INCH_POUNDS_TO_FOOT_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-are-units', label: 'Foot-Pound and Inch-Pound' },
  { id: 'inlbf-to-ftlbf', label: 'Inch-Pounds to Foot-Pounds' },
  { id: 'ftlbf-to-inlbf', label: 'Foot-Pounds to Inch-Pounds' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'torque-engineering', label: 'Torque and Engineering' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'inch-pounds-to-foot-pounds-faq', label: 'Frequently Asked Questions' },
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

const TABLE_INLBF = [1, 6, 12, 24, 36, 48, 60, 72, 96, 100, 120, 180, 240, 600, 1200] as const;

export const INCH_POUNDS_TO_FOOT_POUNDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `The Inch-Pounds to Foot-Pounds Converter converts torque between inch-pound-force (in·lbf) and foot-pound-force (ft·lbf). Enter a value in either field and the equivalent torque updates immediately. The relationship is exact: 1 ft·lbf = ${INCH_POUNDS_PER_FOOT_POUND} in·lbf.`,
    ],
  },
  {
    id: 'what-are-units',
    title: 'What Is a Foot-Pound? What Is an Inch-Pound?',
    paragraphs: [
      'An inch-pound-force of torque is one pound-force applied perpendicular to a one-inch lever arm. A foot-pound-force is one pound-force applied perpendicular to a one-foot lever arm. Because 1 foot = 12 inches, 1 ft·lbf = 12 in·lbf. In this calculator both are torque units, not pounds-mass.',
    ],
    formula: `1 ft·lbf = ${INCH_POUNDS_PER_FOOT_POUND} in·lbf`,
  },
  {
    id: 'inlbf-to-ftlbf',
    title: 'How to Convert Inch-Pounds to Foot-Pounds',
    paragraphs: [
      `Divide inch-pounds by ${INCH_POUNDS_PER_FOOT_POUND}. Example: 48 in·lbf ÷ ${INCH_POUNDS_PER_FOOT_POUND} = ${formatTorque(inchPoundsToFootPounds(48))} ft·lbf.`,
    ],
    formula: `ft·lbf = in·lbf / ${INCH_POUNDS_PER_FOOT_POUND}`,
  },
  {
    id: 'ftlbf-to-inlbf',
    title: 'How to Convert Foot-Pounds to Inch-Pounds',
    paragraphs: [
      `Multiply foot-pounds by ${INCH_POUNDS_PER_FOOT_POUND}. Example: 15 ft·lbf × ${INCH_POUNDS_PER_FOOT_POUND} = ${formatTorque(footPoundsToInchPounds(15))} in·lbf.`,
    ],
    formula: `in·lbf = ft·lbf × ${INCH_POUNDS_PER_FOOT_POUND}`,
  },
  {
    id: 'conversion-table',
    title: 'Conversion Table',
    paragraphs: [
      'Selected inch-pound values converted with the exact 12:1 ratio. Recurring decimals are formatted for reading.',
    ],
    tableHeaders: ['Inch-pounds (in·lbf)', 'Foot-pounds (ft·lbf)'],
    table: TABLE_INLBF.map((inlbf) => ({
      left: formatTorque(inlbf),
      right: formatTorque(inchPoundsToFootPounds(inlbf)),
    })),
    tableNote: `Exact: 1 ft·lbf = ${INCH_POUNDS_PER_FOOT_POUND} in·lbf.`,
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Automotive maintenance, torque wrenches, mechanical engineering, industrial assembly, bolt tightening, bicycle maintenance, machinery, manufacturing, and equipment repair often express torque in inch-pounds or foot-pounds. Converting between them helps compare specifications written in different units.',
    ],
  },
  {
    id: 'torque-engineering',
    title: 'Torque and Mechanical Engineering',
    paragraphs: [
      'Torque is the rotational effect of force at a distance from an axis. Specifications matter because under- or over-tightening fasteners can cause failure. A torque wrench applies a controlled moment; always use the manufacturer’s specified value and unit. Inch-pounds suit smaller fasteners; foot-pounds are common for larger automotive and machinery work.',
    ],
    formula: 'Torque = Force × Perpendicular Lever Arm',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Enter a value in Inch-pounds to read Foot-pounds, or enter Foot-pounds to read Inch-pounds. Copy or share the result, and reset when you need a blank calculator.',
    ],
  },
];

export const INCH_POUNDS_TO_FOOT_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert inch-pounds to foot-pounds?',
    answer: `Divide inch-pounds by ${INCH_POUNDS_PER_FOOT_POUND}.`,
  },
  {
    question: 'How many inch-pounds are in one foot-pound?',
    answer: `Exactly ${INCH_POUNDS_PER_FOOT_POUND} inch-pounds.`,
  },
  {
    question: 'How many foot-pounds are in one inch-pound?',
    answer: `Exactly 1/${INCH_POUNDS_PER_FOOT_POUND} foot-pound, approximately ${formatTorque(inchPoundsToFootPounds(1))}.`,
  },
  {
    question: 'How much is 12 inch-pounds in foot-pounds?',
    answer: 'Exactly 1 foot-pound.',
  },
  {
    question: 'How much is 24 inch-pounds in foot-pounds?',
    answer: 'Exactly 2 foot-pounds.',
  },
  {
    question: 'How much is 36 inch-pounds in foot-pounds?',
    answer: 'Exactly 3 foot-pounds.',
  },
  {
    question: 'How much is 48 inch-pounds in foot-pounds?',
    answer: 'Exactly 4 foot-pounds.',
  },
  {
    question: 'How much is 60 inch-pounds in foot-pounds?',
    answer: 'Exactly 5 foot-pounds.',
  },
  {
    question: 'How much is 89 inch-pounds in foot-pounds?',
    answer: `Approximately ${formatTorque(inchPoundsToFootPounds(89))} ft·lbf.`,
  },
  {
    question: 'How much is 100 inch-pounds in foot-pounds?',
    answer: `Approximately ${formatTorque(inchPoundsToFootPounds(100))} ft·lbf.`,
  },
  {
    question: 'How much is 120 inch-pounds in foot-pounds?',
    answer: 'Exactly 10 ft·lbf.',
  },
  {
    question: 'How do I convert foot-pounds to inch-pounds?',
    answer: `Multiply foot-pounds by ${INCH_POUNDS_PER_FOOT_POUND}.`,
  },
  {
    question: 'How much is 10 foot-pounds in inch-pounds?',
    answer: 'Exactly 120 in·lbf.',
  },
  {
    question: 'What is torque in physics?',
    answer:
      'Torque is the rotational effect of a force applied relative to an axis.',
  },
  {
    question: 'Are inch-pounds and foot-pounds the same unit?',
    answer: `No. Both are torque units, but one foot-pound-force equals ${INCH_POUNDS_PER_FOOT_POUND} inch-pound-force.`,
  },
  {
    question: 'Why is inch-pounds to foot-pounds conversion important?',
    answer:
      'It allows torque measurements expressed in different units to be compared and applied correctly.',
  },
  {
    question: 'Can torque be negative?',
    answer:
      'Yes. Negative signed torque can represent the opposite rotational direction under a selected sign convention.',
  },
  {
    question: 'Can I use this calculator for a torque wrench?',
    answer:
      'Yes for unit conversion. Always follow the relevant manufacturer-provided torque specification.',
  },
];
