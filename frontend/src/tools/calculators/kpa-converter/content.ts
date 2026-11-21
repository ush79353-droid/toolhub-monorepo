import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertPressure,
  formatPressure,
  PASCALS_PER_ATM,
  PASCALS_PER_KPA,
  PASCALS_PER_PSI,
} from './calculation';

export const KPA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-kpa', label: 'What Is a Kilopascal?' },
  { id: 'how-conversion-works', label: 'How Does the kPa Conversion Work?' },
  { id: 'conversion-table', label: 'Pressure Conversion Table' },
  { id: 'how-to-use', label: 'How to Use This kPa Converter' },
  { id: 'where-useful', label: 'Where Are kPa Conversions Useful?' },
  { id: 'related-converters', label: 'Other Related Pressure Converters' },
  { id: 'kpa-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KPA = [1, 5, 10, 20, 50, 100, 101.325, 200, 500, 1000] as const;

const PSI_PER_KPA = PASCALS_PER_KPA / PASCALS_PER_PSI;
const KPA_PER_PSI = PASCALS_PER_PSI / PASCALS_PER_KPA;
const KPA_PER_ATM = PASCALS_PER_ATM / PASCALS_PER_KPA;

export const KPA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-kpa',
    title: 'What Is a Kilopascal?',
    paragraphs: [
      'Use the kPa Converter to quickly convert pressure measurements between kilopascals (kPa), bars, pounds per square inch (psi), and standard atmospheres (atm). Enter a pressure value in any field to calculate the equivalent pressure in the other units automatically.',
      `The pascal is the SI unit of pressure. A kilopascal equals ${PASCALS_PER_KPA} pascals. Pressure is force per unit area: 1 Pa = 1 N/m².`,
      'Kilopascals appear in atmospheric pressure, industrial measurements, and engineering. This converter changes units only; it does not convert gauge pressure into absolute pressure.',
    ],
    formula: `1 kPa = ${PASCALS_PER_KPA} Pa\n1 Pa = 1 N/m²`,
  },
  {
    id: 'how-conversion-works',
    title: 'How Does the kPa Conversion Work?',
    paragraphs: [
      'Conversions share a common base unit (the pascal). Exact relationships include 1 kPa = 0.01 bar and 1 atm = 101.325 kPa.',
      `Approximately 1 kPa ≈ ${formatPressure(PSI_PER_KPA)} psi and 1 kPa ≈ ${formatPressure(convertPressure(1, 'kPa', 'atm'))} atm.`,
      `Convert kPa to bar: bar = kPa ÷ 100. Example: 250 kPa = ${formatPressure(convertPressure(250, 'kPa', 'bar'))} bar.`,
      `Convert kPa to psi: psi ≈ kPa × ${formatPressure(PSI_PER_KPA)}. Example: 200 kPa ≈ ${formatPressure(convertPressure(200, 'kPa', 'psi'))} psi.`,
      `Convert kPa to atmospheres: atm = kPa ÷ ${KPA_PER_ATM}. Example: 101.325 kPa = ${formatPressure(convertPressure(101.325, 'kPa', 'atm'))} atm.`,
    ],
    formula: `bar = kPa ÷ 100\npsi ≈ kPa × ${formatPressure(PSI_PER_KPA)}\natm = kPa ÷ ${KPA_PER_ATM}`,
  },
  {
    id: 'conversion-table',
    title: 'Pressure Conversion Table',
    paragraphs: [
      'Common kilopascal values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['kPa', 'Bar', 'PSI', 'Atmospheres'],
    table: TABLE_KPA.map((kPa) => [
      formatPressure(kPa),
      formatPressure(convertPressure(kPa, 'kPa', 'bar')),
      formatPressure(convertPressure(kPa, 'kPa', 'psi')),
      formatPressure(convertPressure(kPa, 'kPa', 'atm')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use This kPa Converter',
    paragraphs: [
      '1. Enter a pressure value in kilopascals.',
      '2. The equivalent bar, psi, and atmosphere values appear automatically.',
      '3. To convert from another pressure unit, edit its corresponding field.',
      '4. The remaining fields recalculate instantly.',
      '5. Use Reload Calculator to restore defaults or Clear All Changes to empty the fields.',
      'Signed gauge readings are allowed. Absolute-versus-gauge adjustments are not applied automatically.',
    ],
  },
  {
    id: 'where-useful',
    title: 'Where Are kPa Conversions Useful?',
    paragraphs: [
      'People convert kilopascals for tire pressure comparisons, mechanical and civil engineering, weather and atmospheric pressure, HVAC and industrial equipment, hydraulic systems, and scientific pressure measurements.',
      'This page does not provide medical guidance or equipment operating-pressure recommendations.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Pressure Converter, PSI Converter, Bar Converter, Atmosphere Converter, PSI to kPa Converter, Bar to PSI Converter, and Force Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KPA_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Atmospheres to kPa?',
    answer: `Multiply the number of standard atmospheres by ${KPA_PER_ATM}. For example, 2 atm = ${formatPressure(convertPressure(2, 'atm', 'kPa'))} kPa.`,
  },
  {
    question: 'What Is the kPa Value of 150 PSI?',
    answer: `Multiply psi by approximately ${formatPressure(KPA_PER_PSI)}. 150 × ${formatPressure(KPA_PER_PSI)} ≈ ${formatPressure(convertPressure(150, 'psi', 'kPa'))}. Therefore 150 psi is approximately ${formatPressure(convertPressure(150, 'psi', 'kPa'))} kPa.`,
  },
  {
    question: 'Where Is the Conversion of atm to kPa Commonly Used?',
    answer:
      'It is commonly used in meteorology, physics, chemistry, engineering, and other applications where pressure is measured in different units.',
  },
  {
    question: 'Is the Conversion from atm to kPa Linear?',
    answer: `Yes. For standard atmospheres, kPa = atm × ${KPA_PER_ATM}. The relationship is linear.`,
  },
  {
    question: 'How Many PSI Are in 100 kPa?',
    answer: `psi ≈ 100 × ${formatPressure(PSI_PER_KPA)}. Therefore 100 kPa ≈ ${formatPressure(convertPressure(100, 'kPa', 'psi'))} psi.`,
  },
  {
    question: 'Is 1 Bar Equal to 100 kPa?',
    answer: 'Yes. Exactly 1 bar = 100 kPa.',
  },
];
