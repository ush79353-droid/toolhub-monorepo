import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_PSI,
  convertPressure,
  formatPressure,
} from './calculation';

export const PSI_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'PSI Converter' },
  { id: 'what-is-psi', label: 'What Is PSI?' },
  { id: 'how-conversion-works', label: 'How Does PSI Conversion Work?' },
  { id: 'conversion-table', label: 'PSI Conversion Table' },
  { id: 'related-converters', label: 'Other Related Pressure Converters' },
  { id: 'psi-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_PSI = [1, 5, 10, 15, 20, 30, 50, 100, 150] as const;

export const PSI_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'PSI Converter',
    paragraphs: [
      'Convert pounds per square inch (psi) into bar, atmospheres (atm), pascals (Pa), kilopascals (kPa), and other pressure units, or reverse the conversion from any supported field.',
      'Common uses include tire inflation, air compressors, hydraulic and pneumatic systems, engineering calculations, industrial equipment, and laboratory comparisons. This calculator converts units only; it does not change gauge vs absolute reference (psig / psia).',
    ],
  },
  {
    id: 'what-is-psi',
    title: 'What Is PSI?',
    paragraphs: [
      `PSI stands for pounds per square inch; more precisely, pound-force per square inch. Exact international relationship: 1 psi ≈ ${formatPressure(PASCALS_PER_PSI)} Pa.`,
      'PSI is widely used in the United States and in industries that work with customary units. Typical applications include car and bicycle tire pressure, pneumatic equipment, hydraulic systems, air compressors, and fluid pressure measurements.',
      'PSI is the unit. PSIG means gauge pressure relative to a reference atmosphere; PSIA means absolute pressure. Numerical unit conversion does not automatically convert gauge pressure into absolute pressure.',
    ],
    formula: `1 psi ≈ ${formatPressure(PASCALS_PER_PSI)} Pa`,
  },
  {
    id: 'how-conversion-works',
    title: 'How Does PSI Conversion Work?',
    paragraphs: [
      'Convert the source pressure to pascals, then convert that Pascal value into the target unit.',
      `PSI to ATM: atm = psi × (${formatPressure(PASCALS_PER_PSI)} ÷ ${formatPressure(PASCALS_PER_ATM)}) ≈ psi ÷ ${formatPressure(convertPressure(1, 'atm', 'psi'))}. Example: 30 psi ≈ ${formatPressure(convertPressure(30, 'psi', 'atm'))} atm.`,
      `PSI to bar: bar = psi × (${formatPressure(PASCALS_PER_PSI)} ÷ ${formatPressure(PASCALS_PER_BAR)}). Example: 50 psi ≈ ${formatPressure(convertPressure(50, 'psi', 'bar'))} bar.`,
      `PSI to Pascals: Pa = psi × ${formatPressure(PASCALS_PER_PSI)}. Example: 10 psi ≈ ${formatPressure(convertPressure(10, 'psi', 'Pa'))} Pa.`,
      `PSI to kPa: kPa = psi × ${formatPressure(PASCALS_PER_PSI / PASCALS_PER_KPA)}. Example: 35 psi ≈ ${formatPressure(convertPressure(35, 'psi', 'kPa'))} kPa.`,
      `Reverse examples: 1 bar ≈ ${formatPressure(convertPressure(1, 'bar', 'psi'))} psi; 1 atm ≈ ${formatPressure(convertPressure(1, 'atm', 'psi'))} psi; Pa to psi = Pa ÷ ${formatPressure(PASCALS_PER_PSI)}.`,
    ],
    formula: `Pa = psi × ${formatPressure(PASCALS_PER_PSI)}\nbar = psi × ${formatPressure(convertPressure(1, 'psi', 'bar'))}\natm = psi × ${formatPressure(convertPressure(1, 'psi', 'atm'))}`,
  },
  {
    id: 'conversion-table',
    title: 'PSI Conversion Table',
    paragraphs: [
      'Common PSI values with bar, kPa, and atm equivalents generated from the same Pascal-base conversion engine used by the calculator. Displayed decimals are rounded for readability.',
    ],
    tableHeaders: ['PSI', 'Bar', 'kPa', 'ATM'],
    table: TABLE_PSI.map((psi) => [
      formatPressure(psi),
      formatPressure(convertPressure(psi, 'psi', 'bar')),
      formatPressure(convertPressure(psi, 'psi', 'kPa')),
      formatPressure(convertPressure(psi, 'psi', 'atm')),
    ]),
  },
  {
    id: 'related-converters',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages include Pressure Unit Conversion, Pressure Conversion, Pascal Conversion, Pa to PSI Converter, MPa Conversion, MPa to PSI Conversion, MPa to psig Conversion, mmHg to atm Conversion, Bar to PSI Conversion, and kPa to PSI Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PSI_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert ATM to PSI?',
    answer: `Multiply atmospheres by approximately ${formatPressure(convertPressure(1, 'atm', 'psi'))}: psi = atm × ${formatPressure(convertPressure(1, 'atm', 'psi'))}. For example, 2 atm ≈ ${formatPressure(convertPressure(2, 'atm', 'psi'))} psi.`,
  },
  {
    question: 'What Is the PSI if the Pressure Is 15,000 Pa?',
    answer: `psi = 15000 ÷ ${formatPressure(PASCALS_PER_PSI)} ≈ ${formatPressure(convertPressure(15000, 'Pa', 'psi'))}. Therefore 15,000 Pa is approximately ${formatPressure(convertPressure(15000, 'Pa', 'psi'))} psi.`,
  },
  {
    question: 'Why Is Converting PSI Important?',
    answer:
      'Accurate pressure conversions matter when comparing measurements from different regions, pressure instruments, engineering specifications, and industrial systems that report values in psi, bar, kPa, or atmospheres.',
  },
  {
    question: 'Can Pressure Be Negative?',
    answer:
      'Absolute pressure cannot be negative. Gauge pressure can be negative when the measured pressure is below its reference pressure. This converter performs unit conversion without changing the pressure reference.',
  },
  {
    question: 'How Many kPa Are in One PSI?',
    answer: `1 psi ≈ ${formatPressure(convertPressure(1, 'psi', 'kPa'))} kPa.`,
  },
  {
    question: 'Is PSI the Same as PSIG?',
    answer:
      'No. PSI is the pressure unit. PSIG refers to gauge pressure measured relative to a reference atmospheric pressure. PSIA refers to absolute pressure. Numerical conversion between pressure units does not automatically convert gauge pressure into absolute pressure.',
  },
];
