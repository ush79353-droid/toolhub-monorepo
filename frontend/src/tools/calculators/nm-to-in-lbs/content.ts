import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatTorque, inLbsToNm, nmToInLbs } from './calculation';
import {
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
} from './types';

export const NM_TO_IN_LBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-nm', label: 'What Is Nm?' },
  { id: 'nm-and-inlbf', label: 'Newton-meters and Inch-pounds' },
  { id: 'nm-to-inlbf', label: 'How to Convert Nm to in-lbs' },
  { id: 'inlbf-to-nm', label: 'How to Convert in-lbs to Nm' },
  { id: 'conversion-table', label: 'Nm to in-lbs Table' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'nm-vs-ftlbf', label: 'Newton-meters vs Foot-pounds' },
  { id: 'torque-vs-force', label: 'Torque vs Force' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'nm-to-in-lbs-faq', label: 'Frequently Asked Questions' },
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

const TABLE_NM = [0, 1, 2, 5, 10, 12, 20, 25, 50, 100] as const;

export const NM_TO_IN_LBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Nm to in-lbs Converter converts torque between newton-meters (N·m) and inch-pound-force (in·lbf). Enter a value in either field and the equivalent torque updates immediately. Expand More conversion options for related torque units.',
    ],
  },
  {
    id: 'what-is-nm',
    title: 'What Is Nm?',
    paragraphs: [
      'Nm stands for newton-meter, the SI derived unit of torque. Torque is the rotational effect of a force applied at a distance from an axis. Newton-meters appear widely in engineering, mechanics, and automotive specifications.',
      'For a force applied perpendicular to a lever arm, torque equals force times that distance. More generally, magnitude depends on the sine of the angle between the position vector and the force.',
    ],
    formula: 'Torque = Force × Perpendicular Distance',
  },
  {
    id: 'nm-and-inlbf',
    title: 'Newton-meters and Inch-pounds',
    paragraphs: [
      `One newton-meter equals approximately ${formatTorque(nmToInLbs(1))} in·lbf. One inch-pound-force equals exactly ${NEWTON_METERS_PER_INCH_POUND} N·m. In this converter, “inch-pounds” means inch-pound-force torque, not a mass unit.`,
    ],
  },
  {
    id: 'nm-to-inlbf',
    title: 'How to Convert Nm to in-lbs',
    paragraphs: [
      `Divide newton-meters by ${NEWTON_METERS_PER_INCH_POUND}. Example: 10 N·m ≈ ${formatTorque(nmToInLbs(10))} in·lbf.`,
    ],
    formula: `in·lbf = N·m / ${NEWTON_METERS_PER_INCH_POUND}`,
  },
  {
    id: 'inlbf-to-nm',
    title: 'How to Convert in-lbs to Nm',
    paragraphs: [
      `Multiply inch-pounds by ${NEWTON_METERS_PER_INCH_POUND}. Example: 100 in·lbf = ${formatTorque(inLbsToNm(100))} N·m.`,
    ],
    formula: `N·m = in·lbf × ${NEWTON_METERS_PER_INCH_POUND}`,
  },
  {
    id: 'conversion-table',
    title: 'Nm to in-lbs Conversion Table',
    paragraphs: [
      'Selected newton-meter values converted with the shared exact factor. Display figures are formatted for reading; internal math does not round intermediate steps.',
    ],
    tableHeaders: ['Newton-meters (N·m)', 'Inch-pounds (in·lbf), Approx.'],
    table: TABLE_NM.map((nm) => ({
      left: formatTorque(nm),
      right: formatTorque(nmToInLbs(nm)),
    })),
    tableNote: `Exact: 1 in·lbf = ${NEWTON_METERS_PER_INCH_POUND} N·m.`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Nm to Inch Pounds Converter',
    paragraphs: [
      'Enter torque in newton-meters to read inch-pounds, or enter inch-pounds to read newton-meters. Open More conversion options for mN·m, kN·m, ft·lbf, kgf·m, and related units. Copy or reset when finished.',
    ],
  },
  {
    id: 'nm-vs-ftlbf',
    title: 'Newton-meters vs Foot-pounds',
    paragraphs: [
      `Foot-pounds (ft·lbf) are another common torque unit. Exactly 1 ft·lbf = 12 in·lbf, and 1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m. Inch-pound-force suits smaller fastening and maintenance torques; foot-pound-force is common for larger automotive and machinery values.`,
    ],
  },
  {
    id: 'torque-vs-force',
    title: 'Torque vs Force',
    paragraphs: [
      'Torque depends on both force and the distance from the rotation axis. A 10 N force applied perpendicular to a 0.5 m lever arm produces 5 N·m of torque. Force alone (newtons) is not torque; energy (joules) is also a different physical quantity even though 1 N·m and 1 J share SI base dimensions.',
    ],
    formula: 'Torque = 10 N × 0.5 m = 5 N·m',
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Automotive torque specs, engine and bicycle maintenance, bolt tightening, mechanical and aerospace engineering, industrial equipment, robotics, and torque wrenches all need reliable unit conversion. Always take tightening specifications from the applicable manufacturer or engineering documentation.',
    ],
  },
];

export const NM_TO_IN_LBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert Nm to in-lbs?',
    answer: `Divide the newton-meter value by ${NEWTON_METERS_PER_INCH_POUND}.`,
  },
  {
    question: 'How many inch-pounds are in one Newton-meter?',
    answer: `Approximately ${formatTorque(nmToInLbs(1))} in·lbf.`,
  },
  {
    question: 'How much is 5 Newton-meters in inch-pounds?',
    answer: `Approximately ${formatTorque(nmToInLbs(5))} in·lbf.`,
  },
  {
    question: 'How much is 10 Newton-meters in inch-pounds?',
    answer: `Approximately ${formatTorque(nmToInLbs(10))} in·lbf.`,
  },
  {
    question: 'How much is 20 Newton-meters in inch-pounds?',
    answer: `Approximately ${formatTorque(nmToInLbs(20))} in·lbf.`,
  },
  {
    question: 'How much is 25 Newton-meters in inch-pounds?',
    answer: `Approximately ${formatTorque(nmToInLbs(25))} in·lbf.`,
  },
  {
    question: 'How do I convert inch-pounds to Newton-meters?',
    answer: `Multiply inch-pounds by ${NEWTON_METERS_PER_INCH_POUND}.`,
  },
  {
    question: 'How much is 100 in-lbs in Nm?',
    answer: `Exactly ${formatTorque(inLbsToNm(100))} N·m.`,
  },
  {
    question: 'What is the difference between Nm and in-lbs?',
    answer:
      'Both measure torque. Newton-meters are SI; inch-pound-force uses customary length and pound-force.',
  },
  {
    question: 'Is Nm a unit of force?',
    answer: 'No. Newton-meter is a torque unit. Newton is a force unit.',
  },
  {
    question: 'Are inch-pounds and foot-pounds the same?',
    answer: 'No. Exactly 1 ft·lbf = 12 in·lbf.',
  },
  {
    question: 'Is torque the same as energy?',
    answer:
      'No. Torque and energy have different physical meanings despite sharing equivalent SI base dimensions.',
  },
  {
    question: 'Can torque values be negative?',
    answer:
      'Yes. A negative value can represent the opposite rotational direction under the selected sign convention.',
  },
  {
    question: 'What is the formula for torque?',
    answer: 'For a perpendicular applied force: Torque = Force × Lever Arm.',
  },
  {
    question: 'Why are inch-pounds used for bolt tightening?',
    answer:
      'Inch-pound-force is convenient for smaller torque values used in some mechanical and fastening applications.',
  },
  {
    question: 'Can I use this converter for a torque wrench?',
    answer:
      'Yes for unit conversion. Actual tightening specifications must come from the relevant manufacturer or engineering reference.',
  },
];
