import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatTorque, ftLbsToNm, nmToFtLbs } from './calculation';
import {
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_M,
} from './types';
import { nmToInLbs } from '../../shared/torque';

export const NM_TO_FT_LBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-they-measure', label: 'What Nm and ft-lbs Measure' },
  { id: 'nm-to-ftlbf', label: 'Nm to Foot-Pounds' },
  { id: 'nm-table', label: 'Nm to ft-lbs Table' },
  { id: 'ftlbf-to-nm', label: 'ft-lbs to Nm' },
  { id: 'ftlbf-table', label: 'ft-lbs to Nm Table' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'other-units', label: 'Other Torque Units' },
  { id: 'torque-vs-energy', label: 'Torque vs Energy' },
  { id: 'applications', label: 'Applications' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'nm-to-ft-lbs-faq', label: 'Frequently Asked Questions' },
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

const TABLE_NM = [1, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100] as const;
const TABLE_FT = [1, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100] as const;

export const NM_TO_FT_LBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Nm to ft-lbs Converter converts torque between newton-meters (N·m) and foot-pound-force (ft·lbf). Enter either field to update the other instantly, or expand Other torque units for related SI and customary values.',
      'Automotive specs, torque wrenches, motors, and machinery often mix SI and US customary torque units. Accurate conversion keeps fastening and design values consistent across those systems.',
    ],
  },
  {
    id: 'what-they-measure',
    title: 'What Do Nm and ft-lbs Measure?',
    paragraphs: [
      'Newton-meter is the SI-derived unit of torque: the rotational effect of a force about an axis. Foot-pound-force is a common US customary torque unit built from the international foot and pound-force.',
      `Exact relationship: 1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m, so 1 N·m ≈ ${formatTorque(nmToFtLbs(1))} ft·lbf. Both express the same physical torque in different unit systems.`,
    ],
    formula: `1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m   ·   1 N·m ≈ ${formatTorque(nmToFtLbs(1))} ft·lbf`,
  },
  {
    id: 'nm-to-ftlbf',
    title: 'How to Convert Newton-Meters to Foot-Pounds',
    paragraphs: [
      `Divide newton-meters by ${NEWTON_METERS_PER_FOOT_POUND}. Example: 50 N·m ÷ ${NEWTON_METERS_PER_FOOT_POUND} ≈ ${formatTorque(nmToFtLbs(50))} ft·lbf.`,
    ],
    formula: `ft·lbf = N·m / ${NEWTON_METERS_PER_FOOT_POUND}`,
  },
  {
    id: 'nm-table',
    title: 'Newton-Meters to Foot-Pounds Conversion Table',
    paragraphs: [
      'Selected N·m values converted with the shared exact factor. Displayed decimals are rounded for reading; the calculator keeps full internal precision.',
    ],
    tableHeaders: ['Newton-meters (N·m)', 'Foot-pounds (ft·lbf), Approx.'],
    table: TABLE_NM.map((nm) => ({
      left: formatTorque(nm),
      right: formatTorque(nmToFtLbs(nm)),
    })),
    tableNote: `Exact: 1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m.`,
  },
  {
    id: 'ftlbf-to-nm',
    title: 'How to Convert ft-lbs to Nm',
    paragraphs: [
      `Multiply foot-pound-force by ${NEWTON_METERS_PER_FOOT_POUND}. Example: 25 ft·lbf × ${NEWTON_METERS_PER_FOOT_POUND} ≈ ${formatTorque(ftLbsToNm(25))} N·m.`,
    ],
    formula: `N·m = ft·lbf × ${NEWTON_METERS_PER_FOOT_POUND}`,
  },
  {
    id: 'ftlbf-table',
    title: 'Foot-Pounds to Newton-Meters Conversion Table',
    paragraphs: [
      'Selected ft·lbf values converted with the same exact constant.',
    ],
    tableHeaders: ['Foot-pounds (ft·lbf)', 'Newton-meters (N·m)'],
    table: TABLE_FT.map((ft) => ({
      left: formatTorque(ft),
      right: formatTorque(ftLbsToNm(ft)),
    })),
    tableNote: `Exact: 1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m.`,
  },
  {
    id: 'worked-example',
    title: 'Torque Conversion Example',
    paragraphs: [
      `A torque wrench is set to 12 ft·lbf. In newton-meters: 12 × ${NEWTON_METERS_PER_FOOT_POUND} ≈ ${formatTorque(ftLbsToNm(12))} N·m.`,
      'That conversion matters when a service manual lists SI torque while the wrench scale is customary, or the reverse.',
    ],
    formula: `12 ft·lbf × ${NEWTON_METERS_PER_FOOT_POUND} ≈ ${formatTorque(ftLbsToNm(12))} N·m`,
  },
  {
    id: 'other-units',
    title: 'Other Torque Units',
    paragraphs: [
      `Expand Other torque units for kN·m, N·cm, N·mm, in·lbf, kgf·m, kgf·cm, in·ozf, and dyn·cm. All derive from the same canonical N·m value. Exactly 1 ft·lbf = ${INCH_POUNDS_PER_FOOT_POUND} in·lbf, and 1 kgf·m = ${NEWTON_METERS_PER_KGF_M} N·m.`,
    ],
  },
  {
    id: 'torque-vs-energy',
    title: 'Torque vs Energy',
    paragraphs: [
      'Torque and energy can share equivalent SI base dimensions, but they describe different quantities. A joule is energy; a newton-meter of torque is a moment. This converter does not treat joules as torque units.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Nm ↔ ft·lbf conversion supports automotive repair, engine torque specifications, wheel fastener tightening, mechanical engineering, electric motors, industrial machinery, manufacturing, robotics, torque wrenches, and aerospace work whenever documentation mixes SI and customary torque.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      '1. Enter torque in newton-meters and read foot-pounds, or enter foot-pounds and read newton-meters.',
      '2. Both primary fields are editable; the last-edited field is the source.',
      '3. Expand Other torque units for additional conversions.',
      '4. Copy or share the result, reload to restore the demo (10 N·m), or clear all changes.',
    ],
  },
];

export const NM_TO_FT_LBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert Nm to ft-lbs?',
    answer: `Divide newton-meters by ${NEWTON_METERS_PER_FOOT_POUND}.`,
  },
  {
    question: 'How many ft-lbs are in 1 Nm?',
    answer: `Approximately ${formatTorque(nmToFtLbs(1))} ft·lbf.`,
  },
  {
    question: 'What is 10 Nm in ft-lbs?',
    answer: `Approximately ${formatTorque(nmToFtLbs(10))} ft·lbf.`,
  },
  {
    question: 'What is 50 Nm in foot-pounds?',
    answer: `Approximately ${formatTorque(nmToFtLbs(50))} ft·lbf.`,
  },
  {
    question: 'What is 100 Nm in ft-lbs?',
    answer: `Approximately ${formatTorque(nmToFtLbs(100))} ft·lbf.`,
  },
  {
    question: 'How do I convert ft-lbs to Nm?',
    answer: `Multiply foot-pound-force by ${NEWTON_METERS_PER_FOOT_POUND}.`,
  },
  {
    question: 'What is 10 ft-lbs in Nm?',
    answer: `Exactly ${formatTorque(ftLbsToNm(10))} N·m.`,
  },
  {
    question: 'How do I convert inch-lbs to foot-lbs?',
    answer: `Divide inch-pound-force by ${INCH_POUNDS_PER_FOOT_POUND}.`,
  },
  {
    question: 'What is 10 Nm in inch-pounds?',
    answer: `Approximately ${formatTorque(nmToInLbs(10))} in·lbf.`,
  },
  {
    question: 'What is the difference between Nm and ft-lbs?',
    answer:
      'Both measure torque. Newton-meters are SI; foot-pound-force uses the international foot and pound-force.',
  },
  {
    question: 'Is torque the same as force?',
    answer: 'No. Torque measures the rotational effect of force about an axis.',
  },
  {
    question: 'Is Nm the same as Joules?',
    answer:
      'They share equivalent SI base dimensions, but torque and energy are different physical quantities. This tool does not convert joules as torque.',
  },
  {
    question: 'How do I convert kgf-m to Nm?',
    answer: `Multiply kilogram-force meters by ${NEWTON_METERS_PER_KGF_M}.`,
  },
  {
    question: 'How do I convert Nm to kgf-m?',
    answer: `Divide newton-meters by ${NEWTON_METERS_PER_KGF_M}.`,
  },
  {
    question: 'Can torque values be negative?',
    answer:
      'Yes. Negative torque can indicate the opposite rotational direction under a chosen sign convention. This converter preserves the sign.',
  },
  {
    question: 'Where is Nm to ft-lbs conversion used?',
    answer:
      'It is common in automotive work, torque wrench settings, machinery, robotics, and engineering documentation that mixes SI and customary torque.',
  },
  {
    question: 'What is 1 in·lbf in N·m?',
    answer: `Exactly ${NEWTON_METERS_PER_INCH_POUND} N·m.`,
  },
];
