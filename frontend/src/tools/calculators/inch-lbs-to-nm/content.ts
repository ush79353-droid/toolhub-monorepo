import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatTorque, inLbsToNm, nmToInLbs } from './calculation';
import {
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
} from './types';

export const INCH_LBS_TO_NM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-inch-lbs', label: 'What Is Inch-lbs?' },
  { id: 'what-is-nm', label: 'What Is a Newton-meter?' },
  { id: 'inlbf-to-nm', label: 'Inch-lbs to Nm Formula' },
  { id: 'nm-to-inlbf', label: 'Nm to Inch-lbs Formula' },
  { id: 'conversion-table', label: 'Inch-lbs to Nm Table' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'inlbf-vs-ftlbf', label: 'Inch-pounds vs Foot-pounds' },
  { id: 'torque-vs-force', label: 'Torque vs Force' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'inch-lbs-to-nm-faq', label: 'Frequently Asked Questions' },
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

const TABLE_INLBF = [0, 1, 2, 5, 10, 20, 25, 50, 75, 100, 200, 500, 1000] as const;

export const INCH_LBS_TO_NM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Inch-lbs to Nm Converter calculates torque between inch-pound-force (in·lbf) and newton-meters (N·m). Enter a value in either field; the other updates immediately. Expand More conversion options for related torque units.',
    ],
  },
  {
    id: 'what-is-inch-lbs',
    title: 'What Is Inch-lbs?',
    paragraphs: [
      'Inch-lbs is common shorthand for inch-pound-force torque. One inch-pound-force is one pound-force applied perpendicular to a one-inch lever arm. The unit appears often in mechanical fastening and smaller torque-wrench specifications.',
    ],
    formula: 'Torque = Force × Perpendicular Distance',
  },
  {
    id: 'what-is-nm',
    title: 'What Is a Newton-meter?',
    paragraphs: [
      'The newton-meter is the SI-derived unit commonly used for torque: one newton of perpendicular force at a one-meter lever arm. Engineering, automotive, and mechanics contexts use N·m widely. It is not the same as the newton (force) or the joule (energy), even though 1 N·m and 1 J share SI base dimensions.',
    ],
  },
  {
    id: 'inlbf-to-nm',
    title: 'Inch-lbs to Nm Conversion Formula',
    paragraphs: [
      `Multiply inch-pounds by ${NEWTON_METERS_PER_INCH_POUND}. Example: 100 in·lbf = ${formatTorque(inLbsToNm(100))} N·m.`,
    ],
    formula: `N·m = in·lbf × ${NEWTON_METERS_PER_INCH_POUND}`,
  },
  {
    id: 'nm-to-inlbf',
    title: 'Nm to Inch-lbs Conversion Formula',
    paragraphs: [
      `Divide newton-meters by ${NEWTON_METERS_PER_INCH_POUND}. Example: 10 N·m ≈ ${formatTorque(nmToInLbs(10))} in·lbf.`,
    ],
    formula: `in·lbf = N·m / ${NEWTON_METERS_PER_INCH_POUND}`,
  },
  {
    id: 'conversion-table',
    title: 'Inch-lbs to Nm Conversion Table',
    paragraphs: [
      'Selected inch-pound values converted with the shared exact factor. Display figures are formatted for reading; internal math does not round intermediate steps.',
    ],
    tableHeaders: ['Inch-pounds (in·lbf)', 'Newton-meters (N·m)'],
    table: TABLE_INLBF.map((inlbf) => ({
      left: formatTorque(inlbf),
      right: formatTorque(inLbsToNm(inlbf)),
    })),
    tableNote: `Exact: 1 in·lbf = ${NEWTON_METERS_PER_INCH_POUND} N·m.`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Inch-lbs to Nm Converter',
    paragraphs: [
      'Enter torque in inch-pounds to read newton-meters, or enter newton-meters to read inch-pounds. Open More conversion options for mN·m, kN·m, ft·lbf, kgf·m, and related units. Copy, share, or reset when finished.',
    ],
  },
  {
    id: 'inlbf-vs-ftlbf',
    title: 'Inch-pounds vs Foot-pounds',
    paragraphs: [
      `Exactly 1 ft·lbf = 12 in·lbf, so 1 in·lbf = 1/12 ft·lbf. Example: 120 in·lbf = 10 ft·lbf. Also 1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m. Inch-pound-force suits smaller fastening torques; foot-pound-force is common for larger automotive and machinery values.`,
    ],
  },
  {
    id: 'torque-vs-force',
    title: 'Torque vs Force',
    paragraphs: [
      'Force alone (newtons) is not torque. Torque is the rotational effect of force at a distance from an axis. A 20 N force applied perpendicular to a 0.5 m lever arm produces 10 N·m of torque.',
    ],
    formula: 'Torque = 20 N × 0.5 m = 10 N·m',
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Automotive maintenance, torque wrenches, bolt tightening, bicycle repair, small fasteners, industrial assembly, manufacturing, and equipment maintenance all need reliable torque-unit conversion. Always take tightening specifications from the manufacturer or applicable engineering documentation.',
    ],
  },
];

export const INCH_LBS_TO_NM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert inch-lbs to Nm?',
    answer: `Multiply inch-pounds by ${NEWTON_METERS_PER_INCH_POUND}.`,
  },
  {
    question: 'How many Nm are in one inch-pound?',
    answer: `Exactly ${NEWTON_METERS_PER_INCH_POUND} N·m.`,
  },
  {
    question: 'How much is 5 inch-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(5))} N·m.`,
  },
  {
    question: 'How much is 10 inch-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(10))} N·m.`,
  },
  {
    question: 'How much is 50 inch-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(50))} N·m.`,
  },
  {
    question: 'How much is 100 inch-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(100))} N·m.`,
  },
  {
    question: 'How much is 200 inch-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(200))} N·m.`,
  },
  {
    question: 'How much is 500 inch-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(500))} N·m.`,
  },
  {
    question: 'How do I convert Nm to inch-lbs?',
    answer: `Divide newton-meters by ${NEWTON_METERS_PER_INCH_POUND}.`,
  },
  {
    question: 'How many inch-lbs are in one Nm?',
    answer: `Approximately ${formatTorque(nmToInLbs(1))} in·lbf.`,
  },
  {
    question: 'How many inch-lbs are in 10 Nm?',
    answer: `Approximately ${formatTorque(nmToInLbs(10))} in·lbf.`,
  },
  {
    question: 'Are inch-lbs and foot-lbs the same?',
    answer: 'No. One foot-pound-force equals 12 inch-pound-force.',
  },
  {
    question: 'Is torque the same as force?',
    answer:
      'No. Torque is the rotational effect of force applied at a distance from an axis.',
  },
  {
    question: 'Can torque be negative?',
    answer:
      'Yes. Signed torque components may be negative depending on the rotational sign convention.',
  },
  {
    question: 'Can I use this converter for a torque wrench?',
    answer:
      'Yes for unit conversion. Always use the manufacturer’s specified tightening torque.',
  },
  {
    question: 'Are Newton-meters the same as joules?',
    answer:
      'They have equivalent SI base dimensions but describe different physical quantities.',
  },
];
