import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertPressure, formatPressure, fromPascals, toPascals } from './calculation';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from './types';

export const PRESSURE_CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'pressure-units', label: 'Common Pressure Units' },
  { id: 'formulas', label: 'Conversion Formulas' },
  { id: 'conversion-table', label: 'Pressure Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'absolute-vs-gauge', label: 'Absolute vs Gauge' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'pressure-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  bar: string;
  psi: string;
  atm: string;
  pa: string;
  kpa: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_BAR = [0, 0.5, 1, 2, 5, 10, 20] as const;

export const PRESSURE_CONVERSION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Pressure Conversion calculator converts measurements among common pressure units such as bar, pounds per square inch (psi), standard atmospheres (atm), and pascals (Pa). Enter a value in any field; every other displayed unit updates from one canonical pascal value.',
      'Pressure is force per unit area. Different industries historically adopted different units, so reliable conversion between systems is essential for engineering, meteorology, and everyday measurements such as tire pressure.',
    ],
    formula: 'P = F / A',
  },
  {
    id: 'pressure-units',
    title: 'Common Pressure Units',
    paragraphs: [
      `The pascal is the SI-derived unit of pressure: 1 Pa = 1 N/m². One bar equals exactly ${PASCALS_PER_BAR} Pa (100 kPa). One standard atmosphere equals exactly ${PASCALS_PER_ATM} Pa. PSI is pound-force per square inch, derived from the exact pound-force and inch definitions (≈ ${formatPressure(PASCALS_PER_PSI)} Pa). Torr is defined so that 760 Torr = 1 atm. Conventional mmHg (${PASCALS_PER_MMHG} Pa) is close to but not identical to Torr (${formatPressure(PASCALS_PER_TORR)} Pa).`,
    ],
  },
  {
    id: 'formulas',
    title: 'Pressure Conversion Formula Reference',
    paragraphs: [
      `Bar ↔ pascal: Pa = bar × ${PASCALS_PER_BAR}; bar = Pa / ${PASCALS_PER_BAR}. Atmosphere ↔ pascal: Pa = atm × ${PASCALS_PER_ATM}; atm = Pa / ${PASCALS_PER_ATM}. PSI ↔ pascal uses the exact factor ${formatPressure(PASCALS_PER_PSI)} Pa per psi. Convert any supported unit to pascals, then to the target unit.`,
    ],
    formula: `Pa = psi × ${formatPressure(PASCALS_PER_PSI)}`,
  },
  {
    id: 'conversion-table',
    title: 'Pressure Conversion Chart',
    paragraphs: [
      'Selected bar values converted through the shared pascal registry. Display figures are formatted for reading; internal math uses exact factors.',
    ],
    table: TABLE_BAR.map((bar) => {
      const pa = toPascals(bar, 'bar');
      return {
        bar: formatPressure(bar),
        psi: formatPressure(fromPascals(pa, 'psi')),
        atm: formatPressure(fromPascals(pa, 'atm')),
        pa: formatPressure(pa),
        kpa: formatPressure(fromPascals(pa, 'kPa')),
      };
    }),
    tableNote: `Exact: 1 bar = ${PASCALS_PER_BAR} Pa; 1 atm = ${PASCALS_PER_ATM} Pa.`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pressure Converter',
    paragraphs: [
      'Enter a pressure in any of the four primary fields (bar, psi, atmospheres, or pascals) and optionally change that field’s unit—the physical pressure stays the same when you switch units. Expand More conversion options for kPa, Torr, mmHg, inHg, and related units. Copy or reset when finished.',
    ],
  },
  {
    id: 'absolute-vs-gauge',
    title: 'Absolute Pressure vs Gauge Pressure',
    paragraphs: [
      'Absolute pressure is measured from a perfect vacuum. Gauge pressure is relative to a local reference (often ambient air): Gauge = Absolute − Reference. This calculator converts units only. It does not convert gauge pressure to absolute pressure unless you supply the reference separately elsewhere.',
    ],
    formula: 'Absolute = Gauge + Reference',
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Tire pressure, HVAC and process piping, meteorology (hPa/mbar), vacuum systems (Torr), hydraulics, and laboratory work all require consistent pressure-unit conversion. Always interpret signed readings in the context of absolute, gauge, or differential conventions for your instrument.',
    ],
  },
];

export const PRESSURE_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is air pressure?',
    answer:
      'Air pressure, or atmospheric pressure, is the force per unit area exerted by the atmosphere.',
  },
  {
    question: 'What are the units of pressure?',
    answer:
      'Common units include pascals, kilopascals, bars, PSI, atmospheres, torr, and millimeters of mercury.',
  },
  {
    question: 'What is the SI unit of pressure?',
    answer: 'The pascal (Pa).',
  },
  {
    question: 'How many pascals are in one bar?',
    answer: `Exactly ${PASCALS_PER_BAR} Pa.`,
  },
  {
    question: 'How many kilopascals are in one bar?',
    answer: 'Exactly 100 kPa.',
  },
  {
    question: 'How many pascals are in one atmosphere?',
    answer: `Exactly ${PASCALS_PER_ATM} Pa.`,
  },
  {
    question: 'How many bars are in one atmosphere?',
    answer: 'Exactly 1.01325 bar.',
  },
  {
    question: 'How many PSI are in one bar?',
    answer: `Approximately ${formatPressure(convertPressure(1, 'bar', 'psi'))} psi.`,
  },
  {
    question: 'How many PSI are in one atmosphere?',
    answer: `Approximately ${formatPressure(convertPressure(1, 'atm', 'psi'))} psi.`,
  },
  {
    question: 'How do I convert PSI to bar?',
    answer: `Convert PSI to pascals using ${formatPressure(PASCALS_PER_PSI)} Pa per psi, then divide by ${PASCALS_PER_BAR}.`,
  },
  {
    question: 'How do I convert bar to PSI?',
    answer: `Multiply bar by ${formatPressure(convertPressure(1, 'bar', 'psi'))} (exact factor derived from lbf/in²).`,
  },
  {
    question: 'How many Torr are in one atmosphere?',
    answer: 'Exactly 760 Torr.',
  },
  {
    question: 'How much is 2.24 atm in Pa and bar?',
    answer: `2.24 atm = ${formatPressure(toPascals(2.24, 'atm'))} Pa = ${formatPressure(convertPressure(2.24, 'atm', 'bar'))} bar.`,
  },
  {
    question: 'How do I convert pressure to atmospheres?',
    answer: `Convert the source pressure to pascals, then divide by ${PASCALS_PER_ATM}.`,
  },
  {
    question: 'What instrument measures atmospheric pressure?',
    answer: 'A barometer.',
  },
  {
    question: 'What instrument measures pressure inside a pipe or container?',
    answer: 'A pressure gauge or suitable pressure transducer.',
  },
  {
    question: 'Can pressure be negative?',
    answer:
      'Gauge and differential pressures can be negative, but absolute pressure cannot.',
  },
  {
    question: 'What is the difference between pressure and force?',
    answer: 'Pressure is force per unit area.',
  },
  {
    question: 'Is bar the same as PSI?',
    answer: 'No. They are different pressure units.',
  },
  {
    question: 'Why are different pressure units used?',
    answer:
      'Different industries, countries, and scientific applications have historically adopted different measurement systems.',
  },
];
