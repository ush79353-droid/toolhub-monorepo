import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  KPA_PER_ATM,
  atmToKPa,
  formatPressure,
  kPaToAtm,
} from './calculation';

export const KPA_TO_ATM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'kpa-to-atm-formula', label: 'kPa to atm Formula' },
  { id: 'convert-by-hand', label: 'How to Convert kPa to atm by Hand' },
  { id: 'atm-to-kpa', label: 'How to Convert atm to kPa' },
  { id: 'how-to-use', label: 'How to Use the kPa to atm Converter' },
  { id: 'conversion-table', label: 'kPa to atm Conversion Table' },
  { id: 'where-used', label: 'Where Are kPa and atm Used?' },
  { id: 'related-converters', label: 'Other Related Pressure Converters' },
  { id: 'kpa-to-atm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KPA = [1, 5, 10, 20, 50, 100, 101.325, 200, 300, 500, 1000] as const;

export const KPA_TO_ATM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'kpa-to-atm-formula',
    title: 'kPa to atm Formula',
    paragraphs: [
      `Convert pressure from kilopascals (kPa) to standard atmospheres (atm) using the exact relationship 1 atm = ${KPA_PER_ATM} kPa (101,325 Pa).`,
      'Enter a value in kilopascals to obtain atmospheres, or enter atmospheres to convert back to kilopascals. This tool changes numerical pressure units only — it does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
      `Define atm as pressure in standard atmospheres and kPa as pressure in kilopascals.`,
    ],
    formula: `atm = kPa ÷ ${KPA_PER_ATM} · kPa = atm × ${KPA_PER_ATM}`,
  },
  {
    id: 'convert-by-hand',
    title: 'How to Convert kPa to atm by Hand',
    paragraphs: [
      '1. Identify the pressure value in kilopascals.',
      `2. Divide that value by ${KPA_PER_ATM}.`,
      '3. The result is the pressure in standard atmospheres.',
      `Example — convert 300 kPa: 300 ÷ ${KPA_PER_ATM} ≈ ${formatPressure(kPaToAtm(300))}. Therefore 300 kPa ≈ ${formatPressure(kPaToAtm(300))} atm.`,
    ],
    formula: `atm = kPa ÷ ${KPA_PER_ATM}`,
  },
  {
    id: 'atm-to-kpa',
    title: 'How to Convert atm to kPa',
    paragraphs: [
      `Multiply the atmosphere value by ${KPA_PER_ATM}.`,
      `Example — convert 2.5 atm: 2.5 × ${KPA_PER_ATM} = ${formatPressure(atmToKPa(2.5))}. Therefore 2.5 atm = ${formatPressure(atmToKPa(2.5))} kPa.`,
    ],
    formula: `kPa = atm × ${KPA_PER_ATM}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the kPa to atm Converter',
    paragraphs: [
      '1. Enter a pressure measurement in the kPa field.',
      '2. The equivalent atmosphere value appears automatically.',
      '3. To convert in reverse, enter an atmosphere value in the atm field.',
      '4. The kilopascal field updates immediately.',
      '5. Use Reload Calculator or Clear All Changes to reset the inputs.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'kPa to atm Conversion Table',
    paragraphs: [
      'Values generated with the same conversion engine as the calculator (exact 1 atm = 101.325 kPa).',
    ],
    tableHeaders: ['kPa', 'atm'],
    table: TABLE_KPA.map((v) => [formatPressure(v), formatPressure(kPaToAtm(v))]),
  },
  {
    id: 'where-used',
    title: 'Where Are kPa and atm Used?',
    paragraphs: [
      'Kilopascals and standard atmospheres appear in meteorology, physics, chemistry, engineering, pressure measurement equipment, industrial systems, and scientific calculations.',
      'Here atm means the standard atmosphere (exactly 101,325 Pa), not a local weather-station reading of ambient air pressure. Gauge and absolute pressure share the same unit conversion; switching reference bases requires an additional ambient value and is not done automatically.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include kPa Converter, Pressure Converter, PSI Converter, kPa to PSI Converter, PSI to kPa Converter, Bar Converter, Bar to kPa Converter, Atmosphere Converter, atm to kPa Converter, and Pressure Unit Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KPA_TO_ATM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Can I Convert 20 kPa to atm?',
    answer: `Divide 20 by ${KPA_PER_ATM}. atm = 20 ÷ ${KPA_PER_ATM} ≈ ${formatPressure(kPaToAtm(20))}. Therefore 20 kPa is approximately ${formatPressure(kPaToAtm(20))} atm.`,
  },
  {
    question: 'How Much Is 300 kPa in atm?',
    answer: `Use atm = 300 ÷ ${KPA_PER_ATM} ≈ ${formatPressure(kPaToAtm(300))}. Therefore 300 kPa is approximately ${formatPressure(kPaToAtm(300))} atm.`,
  },
  {
    question: 'How Many kPa Are in 1 atm?',
    answer: `One standard atmosphere equals exactly ${KPA_PER_ATM} kPa.`,
  },
  {
    question: 'How Do I Convert atm to kPa?',
    answer: `Multiply the atmosphere value by ${KPA_PER_ATM}. For example, 3 × ${KPA_PER_ATM} = ${formatPressure(atmToKPa(3))}. Therefore 3 atm = ${formatPressure(atmToKPa(3))} kPa.`,
  },
  {
    question: 'Is 100 kPa Equal to 1 atm?',
    answer: `No. 100 kPa ≈ ${formatPressure(kPaToAtm(100))} atm. One standard atmosphere is exactly ${KPA_PER_ATM} kPa.`,
  },
  {
    question: 'What Is the Difference Between kPa and atm?',
    answer:
      'Both measure pressure. The kilopascal is a multiple of the SI pressure unit, the pascal. The standard atmosphere is a defined pressure unit equal to 101,325 pascals.',
  },
];
