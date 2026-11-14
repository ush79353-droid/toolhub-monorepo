import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  footPoundsToNewtonMeters,
  formatTorque,
  newtonMetersToFootPounds,
} from './calculation';
import { NEWTON_METERS_PER_FOOT_POUND, NEWTON_METERS_PER_INCH_POUND } from './types';

export const NEWTON_METER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-nm', label: 'What Is a Newton Meter?' },
  { id: 'calculator', label: 'Newton Meter Calculator' },
  { id: 'conversion', label: 'Newton Meter Conversion' },
  { id: 'torque', label: 'Newton Meter and Torque' },
  { id: 'nm-to-ftlbf', label: 'N·m to ft·lbf Formula' },
  { id: 'ftlbf-to-nm', label: 'ft·lbf to N·m Formula' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'applications', label: 'Applications' },
  { id: 'nm-vs-joule', label: 'Newton-Meter vs Joule' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'newton-meter-faq', label: 'Frequently Asked Questions' },
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

const TABLE_NM = [0, 1, 2, 5, 10, 20, 25, 50, 75, 100, 200, 500, 1000] as const;

export const NEWTON_METER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `The Newton Meter Calculator converts torque between newton-meters (N·m) and foot-pound-force (ft·lbf), with additional torque units available on each field. Exact relationship: 1 ft·lbf = ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m.`,
    ],
  },
  {
    id: 'what-is-nm',
    title: 'What Is a Newton Meter?',
    paragraphs: [
      'A newton-meter is an SI-derived unit of torque: the moment produced by a one-newton force acting perpendicular to a one-meter lever arm. Its symbol is N·m.',
    ],
    formula: '1 N·m = 1 N × 1 m (perpendicular)',
  },
  {
    id: 'calculator',
    title: 'Newton Meter Calculator',
    paragraphs: [
      `Enter a value in either field. Example: 10 N·m ≈ ${formatTorque(newtonMetersToFootPounds(10))} ft·lbf. Reverse: 100 ft·lbf = ${formatTorque(footPoundsToNewtonMeters(100))} N·m.`,
    ],
  },
  {
    id: 'conversion',
    title: 'Newton Meter Conversion',
    paragraphs: [
      'Common torque units include N·m, kN·m, mN·m, N·cm, N·mm, ft·lbf, in·lbf, kgf·m, and kgf·cm. Automotive and US customary work often use ft·lbf or in·lbf; SI engineering work prefers N·m.',
    ],
  },
  {
    id: 'torque',
    title: 'Newton Meter and Torque',
    paragraphs: [
      'Torque τ = r × F × sin(θ). For a perpendicular force, τ = rF. Example: 20 N at 0.5 m gives 10 N·m.',
    ],
    formula: 'τ = rF sin(θ)',
  },
  {
    id: 'nm-to-ftlbf',
    title: 'N·m to ft·lbf Formula',
    paragraphs: [
      `ft·lbf = N·m ÷ ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)}. Example: 10 N·m ≈ ${formatTorque(newtonMetersToFootPounds(10))} ft·lbf.`,
    ],
    formula: `ft·lbf = N·m / ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)}`,
  },
  {
    id: 'ftlbf-to-nm',
    title: 'ft·lbf to N·m Formula',
    paragraphs: [
      `N·m = ft·lbf × ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)}. Example: 100 ft·lbf = ${formatTorque(footPoundsToNewtonMeters(100))} N·m.`,
    ],
    formula: `N·m = ft·lbf × ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)}`,
  },
  {
    id: 'conversion-table',
    title: 'Conversion Table',
    paragraphs: [
      'Selected N·m values converted with the exact constant. Displayed decimals are rounded for reading.',
    ],
    tableHeaders: ['Newton-meters (N·m)', 'Foot-pound-force (ft·lbf)'],
    table: TABLE_NM.map((nm) => ({
      left: formatTorque(nm),
      right: formatTorque(newtonMetersToFootPounds(nm)),
    })),
    tableNote: `Exact: 1 ft·lbf = ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m.`,
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Engine and fastener torque specs, torque wrenches, industrial machinery, electric motors, robotics, manufacturing, and aerospace assembly all use N·m or ft·lbf depending on the documentation standard.',
    ],
  },
  {
    id: 'nm-vs-joule',
    title: 'Newton-Meter vs Joule',
    paragraphs: [
      'N·m and J share the same SI base dimensions, but torque (rotational moment) and energy (work) are different physical quantities. This converter treats N·m as torque only and does not offer joules as a torque unit.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      '1. Enter torque in the first field (default N·m) or the second (default ft·lbf).',
      '2. Change units with the selectors; physical torque is preserved.',
      '3. Open More conversion options for related units.',
      '4. Copy or share the result, or clear all changes to reset.',
    ],
  },
];

export const NEWTON_METER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a newton-meter?',
    answer:
      'An SI-derived torque unit: the moment from a one-newton force acting perpendicular to a one-meter lever arm.',
  },
  {
    question: 'How do I convert Nm to ft-lbs?',
    answer: `Divide newton-meters by ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)}.`,
  },
  {
    question: 'How many foot-pounds are in 1 Nm?',
    answer: `Approximately ${formatTorque(newtonMetersToFootPounds(1))} ft·lbf.`,
  },
  {
    question: 'How many foot-pounds are in 10 Nm?',
    answer: `Approximately ${formatTorque(newtonMetersToFootPounds(10))} ft·lbf.`,
  },
  {
    question: 'How many newton-meters are in 100 ft-lbs?',
    answer: `Exactly ${formatTorque(footPoundsToNewtonMeters(100))} N·m.`,
  },
  {
    question: 'How do I convert foot-pounds to Nm?',
    answer: `Multiply ft·lbf by ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)}.`,
  },
  {
    question: 'Can we measure torque in newton-meters?',
    answer: 'Yes. Newton-meter is the SI-derived unit of torque.',
  },
  {
    question: 'Is a newton-meter equal to a joule?',
    answer:
      'They share SI base dimensions, but torque and energy are different quantities and should not be treated as interchangeable here.',
  },
  {
    question: 'How much is 2.4 foot-pounds in newton-meters?',
    answer: `Exactly ${formatTorque(footPoundsToNewtonMeters(2.4))} N·m.`,
  },
  {
    question: 'What is the difference between torque and force?',
    answer:
      'Force may change linear motion; torque is the rotational effect of force about an axis.',
  },
  {
    question: 'Is negative torque possible?',
    answer:
      'Yes. The sign can indicate rotational direction relative to a chosen convention.',
  },
  {
    question: 'How do I calculate torque using force and distance?',
    answer: 'For a perpendicular force: Torque = Force × Lever Arm.',
  },
  {
    question: 'What is the relationship between Nm and in-lbs?',
    answer: `1 N·m ≈ ${formatTorque(1 / NEWTON_METERS_PER_INCH_POUND)} in·lbf.`,
  },
  {
    question: 'What is the difference between ft-lbf and in-lbf?',
    answer: 'Exactly 1 ft·lbf = 12 in·lbf.',
  },
  {
    question: 'Where are newton-meters commonly used?',
    answer:
      'Mechanical engineering, automotive specs, industrial machinery, robotics, and scientific calculations.',
  },
];
