import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  KPA_PER_PSI,
  PSI_PER_KPA,
  formatPressure,
  kPaToPsi,
  psiToKPa,
} from './calculation';

export const KPA_TO_PSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the kPa to psi Conversion Tool' },
  { id: 'units', label: 'Kilopascals and Pounds per Square Inch' },
  { id: 'conversion', label: 'kPa to psi Pressure Conversion' },
  { id: 'conversion-table', label: 'kPa to psi Conversion Table' },
  { id: 'related-converters', label: 'Other Pressure Conversion Tools' },
  { id: 'kpa-to-psi-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KPA = [
  0, 1, 2, 5, 7, 10, 20, 40, 50, 100, 101.325, 200, 210, 300, 500, 1000,
] as const;

export const KPA_TO_PSI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the kPa to psi Conversion Tool',
    paragraphs: [
      'Convert pressure between kilopascals and pounds per square inch instantly. Both directions update in real time — no separate Calculate button is required.',
      '1. Enter the pressure in kilopascals.',
      '2. The calculator immediately converts the value to psi.',
      '3. To perform the reverse conversion, enter a value in the psi field.',
      '4. The calculator automatically displays the equivalent pressure in kPa.',
      '5. Use Reload Calculator or Clear All Changes to start again.',
      'This tool changes numerical pressure units only. It does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
    ],
  },
  {
    id: 'units',
    title: 'Kilopascals and Pounds per Square Inch',
    paragraphs: [
      'A kilopascal (kPa) is a metric pressure unit equal to 1,000 pascals. It is commonly used in engineering, weather information, industrial pressure measurements, and tire pressure specifications.',
      'Psi is pounds-force per square inch. It is commonly used for tire pressures, compressed air systems, hydraulic equipment, and other pressure measurements.',
      'Both units measure the same physical quantity: force per unit area.',
    ],
  },
  {
    id: 'conversion',
    title: 'kPa to psi Pressure Conversion',
    paragraphs: [
      `Multiply kilopascals by approximately ${formatPressure(PSI_PER_KPA)} to obtain psi. Example — convert 40 kPa: 40 × ${formatPressure(PSI_PER_KPA)} ≈ ${formatPressure(kPaToPsi(40))}. Therefore 40 kPa ≈ ${formatPressure(kPaToPsi(40))} psi.`,
      `For the reverse conversion, multiply psi by approximately ${formatPressure(KPA_PER_PSI)}. Example — convert 15 psi: 15 × ${formatPressure(KPA_PER_PSI)} ≈ ${formatPressure(psiToKPa(15))}. Therefore 15 psi ≈ ${formatPressure(psiToKPa(15))} kPa.`,
    ],
    formula: `psi = kPa × ${formatPressure(PSI_PER_KPA)} · kPa = psi × ${formatPressure(KPA_PER_PSI)}`,
  },
  {
    id: 'conversion-table',
    title: 'kPa to psi Conversion Table',
    paragraphs: [
      'Values generated with the same conversion engine as the calculator. Displayed results are rounded for readability.',
    ],
    tableHeaders: ['kPa', 'psi'],
    table: TABLE_KPA.map((v) => [formatPressure(v), formatPressure(kPaToPsi(v))]),
  },
  {
    id: 'related-converters',
    title: 'Other Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include kPa Converter, kPa to atm Conversion, kPa to mmHg Conversion, Pressure Converter, PSI Converter, PSI to kPa Converter, Bar to kPa Converter, kPa to Bar Converter, PSI to Bar Converter, and Bar to PSI Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KPA_TO_PSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert Pressure from kPa to psi?',
    answer: `Multiply the pressure in kilopascals by approximately ${formatPressure(PSI_PER_KPA)}. For example, 100 kPa ≈ ${formatPressure(kPaToPsi(100))} psi.`,
  },
  {
    question: 'How Do You Convert 210 kPa to psi?',
    answer: `Multiply 210 by approximately ${formatPressure(PSI_PER_KPA)}. 210 × ${formatPressure(PSI_PER_KPA)} ≈ ${formatPressure(kPaToPsi(210))}. Therefore 210 kPa ≈ ${formatPressure(kPaToPsi(210))} psi.`,
  },
  {
    question: 'How Many kPa Are in 1 psi?',
    answer: `One psi equals approximately ${formatPressure(KPA_PER_PSI)} kPa.`,
  },
  {
    question: 'How Many psi Are in 100 kPa?',
    answer: `100 kPa equals approximately ${formatPressure(kPaToPsi(100))} psi.`,
  },
  {
    question: 'Is 30 psi Equal to 200 kPa?',
    answer: `Not exactly. 30 psi is approximately ${formatPressure(psiToKPa(30))} kPa.`,
  },
  {
    question: 'How Can I Convert psi to kPa?',
    answer: `Multiply the psi value by approximately ${formatPressure(KPA_PER_PSI)}. For example, 20 × ${formatPressure(KPA_PER_PSI)} ≈ ${formatPressure(psiToKPa(20))}. Therefore 20 psi ≈ ${formatPressure(psiToKPa(20))} kPa.`,
  },
];
