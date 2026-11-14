import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertForce, formatForce, fromNewtons } from './calculation';
import {
  NEWTONS_PER_DYNE,
  NEWTONS_PER_GF,
  NEWTONS_PER_KGF,
  NEWTONS_PER_LBF,
  NEWTONS_PER_TF,
  STANDARD_GRAVITY,
} from './types';

export const FORCE_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'force-units', label: 'Force Units' },
  { id: 'force-conversions', label: 'Force Conversions' },
  { id: 'newton-unit', label: 'Newton Unit' },
  { id: 'mass-vs-force', label: 'Mass Versus Force' },
  { id: 'other-units', label: 'Dynes, kgf, lbf & More' },
  { id: 'conversion-table', label: 'Force Conversion Table' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'force-vs-pressure', label: 'Force Versus Pressure' },
  { id: 'force-converter-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  n: string;
  kn: string;
  dyn: string;
  lbf: string;
  kgf: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_N = [1, 5, 10, 50, 100, 500, 1000, 5000, 10_000] as const;

export const FORCE_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Force Converter expresses the same physical force in SI, CGS, gravitational, and imperial units. Enter a value in any field; every other displayed unit updates from one canonical newton value.',
    ],
  },
  {
    id: 'force-units',
    title: 'Force Units',
    paragraphs: [
      'Common force units include the newton (N), kilonewton (kN), dyne (dyn), pound-force (lbf), gram-force (gf), kilogram-force (kgf), and metric tonne-force (tf). Engineering also uses kip-force, ounce-force, and poundal. Each unit appears in specific scientific or trade contexts.',
    ],
  },
  {
    id: 'force-conversions',
    title: 'Force Conversions',
    paragraphs: [
      `Exact relationships used by this converter include 1 kN = 1000 N, 1 N = 100000 dyn, 1 kgf = ${NEWTONS_PER_KGF} N, 1 gf = ${NEWTONS_PER_GF} N, 1 lbf = ${formatForce(NEWTONS_PER_LBF)} N, and 1 tf = ${NEWTONS_PER_TF} N.`,
    ],
  },
  {
    id: 'newton-unit',
    title: 'Newton Unit',
    paragraphs: [
      'The newton is the SI derived unit of force. One newton is the force that accelerates one kilogram of mass at one meter per second squared: 1 N = 1 kg·m/s². Newton’s second law relates force, mass, and acceleration.',
    ],
    formula: 'F = m × a',
  },
  {
    id: 'mass-vs-force',
    title: 'What Is the Difference Between Mass and Force?',
    paragraphs: [
      'Mass measures the amount of matter and is expressed in kilograms. Force can change an object’s motion and is expressed in newtons. Weight is the gravitational force on a mass: Weight force = Mass × gravitational acceleration. Kilogram-force and pound-force are force units defined with standard gravity; they are not mass units.',
    ],
  },
  {
    id: 'other-units',
    title: 'Dynes, Kiloponds, Pounds-force, and Other Units',
    paragraphs: [
      `In the CGS system, 1 dyne = ${NEWTONS_PER_DYNE} N. The kilopond (kp) is another name for kilogram-force: 1 kp = 1 kgf = ${NEWTONS_PER_KGF} N. One pound-force equals one avoirdupois pound times standard gravity (${STANDARD_GRAVITY} m/s²), or ${formatForce(NEWTONS_PER_LBF)} N. One poundal equals one pound-mass times one foot per second squared. One kip-force equals 1000 lbf.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Force Conversion Table',
    paragraphs: [
      'Selected newton values converted through the shared force registry. Displayed figures are formatted for reading; internal math uses exact factors.',
    ],
    table: TABLE_N.map((n) => ({
      n: formatForce(n),
      kn: formatForce(fromNewtons(n, 'kN')),
      dyn: formatForce(fromNewtons(n, 'dyn')),
      lbf: formatForce(fromNewtons(n, 'lbf')),
      kgf: formatForce(fromNewtons(n, 'kgf')),
    })),
    tableNote: `Exact: 1 kgf = ${NEWTONS_PER_KGF} N; 1 lbf = ${formatForce(NEWTONS_PER_LBF)} N; 1 N = 100000 dyn.`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Force Converter',
    paragraphs: [
      'Enter a force in any of the seven fields and optionally change that field’s unit—the physical force stays the same when you switch units. Expand More force units for µN, MN, kip, poundal, and ton-force equivalents. Copy or reset when finished.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Physics labs, mechanical and structural engineering, machinery loads, automotive and aerospace work, materials testing, and education all need reliable force-unit conversion.',
    ],
  },
  {
    id: 'force-vs-pressure',
    title: 'Why Force Is Different From Pressure',
    paragraphs: [
      'Pressure is force per unit area: P = F / A. Force is measured in newtons; pressure is measured in pascals. You cannot convert force to pressure without knowing the area over which the force acts.',
    ],
    formula: 'P = F / A',
  },
];

export const FORCE_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the SI unit of force?',
    answer: 'The newton (N).',
  },
  {
    question: 'What is one newton?',
    answer: 'One newton equals one kilogram-meter per second squared: 1 N = 1 kg·m/s².',
  },
  {
    question: 'How many newtons are in one kilonewton?',
    answer: 'Exactly 1000 N.',
  },
  {
    question: 'How many dynes are in one newton?',
    answer: 'Exactly 100000 dyn.',
  },
  {
    question: 'How many newtons are in one dyne?',
    answer: `Exactly ${NEWTONS_PER_DYNE} N.`,
  },
  {
    question: 'How many newtons are in one pound-force?',
    answer: `Exactly ${formatForce(NEWTONS_PER_LBF)} N.`,
  },
  {
    question: 'How many pounds-force are in one newton?',
    answer: `Approximately ${formatForce(convertForce(1, 'N', 'lbf'))} lbf.`,
  },
  {
    question: 'How many newtons are in one kilogram-force?',
    answer: `Exactly ${NEWTONS_PER_KGF} N.`,
  },
  {
    question: 'How many kilograms-force are in one newton?',
    answer: `Approximately ${formatForce(convertForce(1, 'N', 'kgf'))} kgf.`,
  },
  {
    question: 'How many grams-force equal one kilogram-force?',
    answer: 'Exactly 1000 gf.',
  },
  {
    question: 'How many newtons are in one tonne-force?',
    answer: `Exactly ${NEWTONS_PER_TF} N for metric tonne-force.`,
  },
  {
    question: 'How do I convert kilonewtons into newtons?',
    answer: 'Multiply kilonewtons by 1000.',
  },
  {
    question: 'How do I convert newtons to pounds-force?',
    answer: `Divide newtons by ${formatForce(NEWTONS_PER_LBF)}.`,
  },
  {
    question: 'What is the difference between pounds and pounds-force?',
    answer: 'Pounds measure mass, while pounds-force measure force.',
  },
  {
    question: 'Is kilogram-force the same as kilogram?',
    answer: 'No. Kilogram measures mass, while kilogram-force measures force.',
  },
  {
    question: 'What is a kip-force?',
    answer: 'One kip-force equals 1000 pounds-force.',
  },
  {
    question: 'Can force be negative?',
    answer:
      'Yes. A signed force component may be negative depending on the selected direction or coordinate axis.',
  },
  {
    question: 'Can I convert force into pressure?',
    answer: 'Only if the area over which the force acts is known.',
  },
  {
    question: 'Does gravity affect force measurements?',
    answer: `Gravitational force depends on local gravitational acceleration, but conventional kilogram-force and pound-force use standard gravity ${STANDARD_GRAVITY} m/s².`,
  },
];
