import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  KGFCM2_TO_PSI,
  formatPressure,
  kgfCm2ToPsi,
  psiToKgfCm2,
} from './calculation';
import { PASCALS_PER_KGFCM2, PASCALS_PER_PSI } from './types';

export const KGCM_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the kg/cm² to PSI Converter' },
  { id: 'kgcm-to-psi-formula', label: 'kg/cm² to PSI Formula' },
  { id: 'psi-to-kgcm', label: 'How to Convert PSI to kg/cm²' },
  { id: 'what-is-kgcm', label: 'What Is kg/cm²?' },
  { id: 'what-is-psi', label: 'What Is PSI?' },
  { id: 'conversion-table', label: 'kg/cm² to PSI Conversion Table' },
  { id: 'where-used', label: 'Where Are kg/cm² and PSI Used?' },
  { id: 'related-converters', label: 'Related Pressure Calculators' },
  { id: 'kgcm-to-psi-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KGF = [0, 0.1, 0.5, 1, 2, 3, 3.6, 5, 7, 10, 20, 50, 100] as const;

export const KGCM_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the kg/cm² to PSI Converter',
    paragraphs: [
      'This calculator converts between kilograms-force per square centimeter (kgf/cm²) and pounds-force per square inch (psi). Both directions update in real time.',
      '1. Enter a pressure value in kgf/cm².',
      '2. View the equivalent pressure in PSI.',
      '3. Alternatively, enter PSI to calculate kgf/cm².',
      '4. Edit either input at any time to recalculate.',
      'The page title uses kg/cm² as conventional industrial shorthand; calculations use the force-based unit kgf/cm². The converter changes numerical units only; it does not switch absolute vs gauge reference.',
    ],
  },
  {
    id: 'kgcm-to-psi-formula',
    title: 'kg/cm² to PSI Formula',
    paragraphs: [
      `Multiply kilograms-force per square centimeter by ${formatPressure(KGFCM2_TO_PSI)} to obtain psi. The factor comes from 1 kgf/cm² = ${PASCALS_PER_KGFCM2.toLocaleString('en-US')} Pa and 1 psi = ${PASCALS_PER_PSI} Pa.`,
      `Example; convert 7 kgf/cm²: 7 × ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(kgfCm2ToPsi(7))} psi.`,
    ],
    formula: `psi = kgf/cm² × ${formatPressure(KGFCM2_TO_PSI)}`,
  },
  {
    id: 'psi-to-kgcm',
    title: 'How to Convert PSI to kg/cm²',
    paragraphs: [
      `Divide psi by ${formatPressure(KGFCM2_TO_PSI)} (equivalently multiply by ${formatPressure(1 / KGFCM2_TO_PSI)}).`,
      `Example; convert 100 psi: 100 ÷ ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(psiToKgfCm2(100))} kgf/cm².`,
    ],
    formula: `kgf/cm² = psi ÷ ${formatPressure(KGFCM2_TO_PSI)}`,
  },
  {
    id: 'what-is-kgcm',
    title: 'What Is kg/cm²?',
    paragraphs: [
      'In pressure specifications, kg/cm² is commonly used as shorthand for kgf/cm²; kilogram-force per square centimeter. Kilogram is a mass unit; kilogram-force is a force unit equal to the weight of one kilogram under standard gravity (9.80665 m/s²).',
      `Exactly 1 kgf/cm² = ${PASCALS_PER_KGFCM2.toLocaleString('en-US')} Pa (also equal to one technical atmosphere, at). Use kgf/cm² when precise force-based notation is required.`,
    ],
  },
  {
    id: 'what-is-psi',
    title: 'What Is PSI?',
    paragraphs: [
      'PSI means pounds-force per square inch. It is widely used in US customary and imperial contexts for tire inflation, compressors, hydraulics, and industrial gauges.',
      `By definition used here, 1 psi = ${PASCALS_PER_PSI} Pa. The SI unit of pressure is the pascal (Pa).`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'kg/cm² to PSI Conversion Table',
    paragraphs: [
      'Values generated with the same conversion engine as the calculator.',
    ],
    tableHeaders: ['kgf/cm²', 'psi'],
    table: TABLE_KGF.map((v) => [formatPressure(v), formatPressure(kgfCm2ToPsi(v))]),
  },
  {
    id: 'where-used',
    title: 'Where Are kg/cm² and PSI Used?',
    paragraphs: [
      'Both units appear on tire inflation charts, industrial pressure gauges, hydraulic systems, compressors, pumps, and equipment nameplates. Metric markets often list kgf/cm² (or kg/cm² shorthand); US customary markets often list psi.',
      'When reading real gauges, distinguish gauge pressure (relative to ambient) from absolute pressure. This calculator converts the numerical magnitude between units and does not change the reference basis.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Related Pressure Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include PSI Converter, Pressure Converter, Bar to PSI Converter, PSI to Bar Converter, kPa to PSI Converter, PSI to kPa Converter, MPa to PSI Converter, Pa to PSI Converter, and Bar to Pa Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KGCM_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I Convert kg/cm² to PSI?',
    answer: `Yes. Multiply the pressure in kgf/cm² by approximately ${formatPressure(KGFCM2_TO_PSI)}.`,
  },
  {
    question: 'How Many PSI Are in 1 kg/cm²?',
    answer: `1 kgf/cm² ≈ ${formatPressure(kgfCm2ToPsi(1))} psi.`,
  },
  {
    question: 'How Much Is 7 kg/cm² in PSI?',
    answer: `7 × ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(kgfCm2ToPsi(7))}. Therefore 7 kgf/cm² ≈ ${formatPressure(kgfCm2ToPsi(7))} psi.`,
  },
  {
    question: 'How Much Is 3.6 kg/cm² in PSI?',
    answer: `3.6 × ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(kgfCm2ToPsi(3.6))}. Therefore 3.6 kgf/cm² ≈ ${formatPressure(kgfCm2ToPsi(3.6))} psi.`,
  },
  {
    question: 'What Is 9 PSI Equal to in kg/cm²?',
    answer: `9 ÷ ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(psiToKgfCm2(9))}. Therefore 9 psi ≈ ${formatPressure(psiToKgfCm2(9))} kgf/cm².`,
  },
  {
    question: 'Is kg/cm² the Same as kgf/cm²?',
    answer:
      'In many practical pressure specifications, kg/cm² is used informally to mean kgf/cm². Strictly speaking, kilogram is a unit of mass, while kilogram-force is a unit of force. Use kgf/cm² for precise pressure notation.',
  },
  {
    question: 'Is PSI an SI Unit?',
    answer: 'No. The SI unit of pressure is the pascal (Pa).',
  },
];
