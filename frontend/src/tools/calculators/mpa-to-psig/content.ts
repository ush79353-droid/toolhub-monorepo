import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  MPA_PER_PSIG,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PSIG_PER_MPA,
  STANDARD_ATMOSPHERIC_MPA,
  STANDARD_ATMOSPHERIC_PSI,
  formatPressure,
  mpaGaugeToPsig,
  psigToMpaGauge,
} from './calculation';

export const MPA_TO_PSIG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'MPa to PSIG Conversion' },
  { id: 'how-to-use', label: 'How to Use the MPa to PSIG Converter' },
  { id: 'formula', label: 'MPa to PSIG Formula' },
  { id: 'example-6-mpa', label: 'Convert 6 MPa to PSIG' },
  { id: 'psi-vs-psig', label: 'What Is the Difference Between PSI and PSIG?' },
  { id: 'conversion-table', label: 'MPa to PSIG Conversion Chart' },
  { id: 'related-tools', label: 'Pressure Conversion Family' },
  { id: 'mpa-to-psig-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MPA = [0, 0.1, 0.5, 1, 2, 5, 6, 10, 20, 50, 100] as const;

export const MPA_TO_PSIG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'MPa to PSIG Conversion',
    paragraphs: [
      'Convert metric gauge pressure in megapascals (MPa(g)) into imperial gauge pressure in pounds-force per square inch gauge (psig). Useful for hydraulic equipment, industrial gauges, pneumatic systems, automotive testing, engineering specifications, and pressure monitoring.',
      'Both calculator fields are gauge pressures relative to atmospheric pressure. Absolute MPa(a) or psia are not converted in the primary inputs, and no atmospheric offset is subtracted from MPa(g).',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the MPa to PSIG Converter',
    paragraphs: [
      '1. Enter the gauge pressure in megapascals (MPa(g)).',
      '2. Read the converted psig value.',
      '3. Alternatively, enter a psig measurement.',
      '4. Read the equivalent MPa(g) result.',
      '5. Convert in either direction — no separate Calculate button is required.',
      '6. Use Reload Calculator or Clear All Changes to start over, or share the result.',
    ],
  },
  {
    id: 'formula',
    title: 'MPa to PSIG Formula',
    paragraphs: [
      `Exactly 1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} Pa and 1 psi = ${formatPressure(PASCALS_PER_PSI)} Pa (international pound-force and inch).`,
      `For gauge-to-gauge conversion, 1 MPa(g) ≈ ${formatPressure(PSIG_PER_MPA)} psig, and 1 psig ≈ ${formatPressure(MPA_PER_PSIG)} MPa(g).`,
      'The factor ≈145.0377 is the physically correct MPa↔psi relationship. Approximate factors near 130.34 apply only when converting absolute pressure with an atmospheric offset — not for MPa(g) ↔ psig.',
    ],
    formula: `1 MPa = ${PASCALS_PER_MPA.toLocaleString('en-US')} Pa\n1 psi = ${formatPressure(PASCALS_PER_PSI)} Pa\npsig = MPa(g) × ${formatPressure(PSIG_PER_MPA)}`,
  },
  {
    id: 'example-6-mpa',
    title: 'Convert 6 MPa to PSIG',
    paragraphs: [
      `Given P = 6 MPa(g). Formula: psig = 6 × ${formatPressure(PSIG_PER_MPA)}.`,
      `Result: psig ≈ ${formatPressure(mpaGaugeToPsig(6))}. Both values describe the same pressure difference above ambient.`,
      `Reverse check: ${formatPressure(mpaGaugeToPsig(6))} psig × ${formatPressure(MPA_PER_PSIG)} ≈ ${formatPressure(psigToMpaGauge(mpaGaugeToPsig(6)))} MPa(g).`,
    ],
    formula: `6 × ${formatPressure(PSIG_PER_MPA)} ≈ ${formatPressure(mpaGaugeToPsig(6))} psig`,
  },
  {
    id: 'psi-vs-psig',
    title: 'What Is the Difference Between PSI and PSIG?',
    paragraphs: [
      'Psi is a pressure unit (pounds-force per square inch). Psig specifically means gauge pressure relative to ambient atmospheric pressure. Psia means absolute pressure relative to a perfect vacuum.',
      `Relationship: psia = psig + atmospheric pressure in psi. At standard atmosphere, Patm = ${formatPressure(STANDARD_ATMOSPHERIC_MPA)} MPa ≈ ${formatPressure(STANDARD_ATMOSPHERIC_PSI)} psi.`,
      'Local atmospheric pressure varies with weather and altitude. Gauge = absolute − atmospheric. This calculator never subtracts Patm from an MPa(g) value.',
    ],
    formula: `P_gauge = P_absolute − P_atm\npsia ≈ psig + ${formatPressure(STANDARD_ATMOSPHERIC_PSI)} (standard atm)`,
  },
  {
    id: 'conversion-table',
    title: 'MPa to PSIG Conversion Chart',
    paragraphs: [
      'Common MPa(g) values converted with the same engine as the calculator (factor ≈145.0377, not ≈130.34).',
    ],
    tableHeaders: ['MPa(g)', 'psig (approximately)'],
    table: TABLE_MPA.map((v) => [formatPressure(v), formatPressure(mpaGaugeToPsig(v))]),
  },
  {
    id: 'related-tools',
    title: 'Pressure Conversion Family',
    paragraphs: [
      'Related Omega Calculators pages may include MPa Conversion, MPa to PSI Conversion, kPa Converter, kPa to PSI Conversion, KSI to MPa Converter, Pressure Conversion, Bar to PSI Conversion, PSI Converter, and PSI to PSIA Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MPA_TO_PSIG_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I Convert Megapascals to PSIG?',
    answer: `Yes, when the input is gauge pressure. Multiply MPa(g) by approximately ${formatPressure(PSIG_PER_MPA)}. For absolute pressure, atmospheric pressure must also be accounted for separately — this calculator does not do that automatically.`,
  },
  {
    question: 'How Much Is 300 PSIG in MPa?',
    answer: `300 × ${formatPressure(MPA_PER_PSIG)} ≈ ${formatPressure(psigToMpaGauge(300))} MPa(g).`,
  },
  {
    question: 'How Much Is 1 MPa in PSIG?',
    answer: `1 MPa(g) ≈ ${formatPressure(PSIG_PER_MPA)} psig.`,
  },
  {
    question: 'How Do I Convert 10 MPa to PSIG?',
    answer: `10 × ${formatPressure(PSIG_PER_MPA)} ≈ ${formatPressure(mpaGaugeToPsig(10))} psig.`,
  },
  {
    question: 'Is MPa the Same as PSIG?',
    answer:
      'No. MPa is a pressure unit; psig specifically denotes gauge pressure in pounds-force per square inch. An MPa reading must be identified as absolute or gauge before interpreting it as psig.',
  },
  {
    question: 'Can PSIG Be Negative?',
    answer:
      'Yes. Negative psig indicates pressure below the chosen atmospheric reference. It is not the same as negative absolute pressure.',
  },
  {
    question: 'What Is the Difference Between PSIG and PSIA?',
    answer: `PSIG is gauge pressure; PSIA is absolute pressure. At standard atmospheric pressure, psia ≈ psig + ${formatPressure(STANDARD_ATMOSPHERIC_PSI)}.`,
  },
];
