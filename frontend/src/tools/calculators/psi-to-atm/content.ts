import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  ATM_PER_PSI,
  PASCALS_PER_ATM,
  PASCALS_PER_PSI,
  PSI_PER_ATM,
  atmToPsi,
  formatPressure,
  psiToAtm,
} from './calculation';

export const PSI_TO_ATM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'PSI to ATM Conversion' },
  { id: 'how-to-use', label: 'How to Use the PSI to ATM Conversion Tool' },
  { id: 'psi-to-atm', label: 'How to Calculate Pressure in Atmospheres from PSI' },
  { id: 'atm-to-psi', label: 'How to Convert ATM to PSI' },
  { id: 'what-is-psi', label: 'What Is PSI?' },
  { id: 'what-is-atm', label: 'What Is an Atmosphere?' },
  { id: 'conversion-table', label: 'PSI to ATM Conversion Table' },
  { id: 'gauge-vs-absolute', label: 'Gauge Pressure vs Absolute Pressure' },
  { id: 'related-converters', label: 'Other Pressure Conversion Tools' },
  { id: 'psi-to-atm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_PSI = [0, 1, 5, 10, 14.6959488, 15, 30, 50, 100, 150, 200, 500, 1000] as const;

export const PSI_TO_ATM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'PSI to ATM Conversion',
    paragraphs: [
      'Convert pounds per square inch (psi) to standard atmospheres (atm) and reverse the conversion instantly. PSI is common in industrial and customary systems; the standard atmosphere is a defined scientific pressure unit equal to exactly 101,325 Pa.',
      'Useful for engineering comparisons, scientific calculations, and translating equipment ratings. This calculator converts units only; it does not add or subtract atmospheric pressure to change gauge vs absolute reference.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the PSI to ATM Conversion Tool',
    paragraphs: [
      '1. Enter the pressure in PSI in the first field.',
      '2. View the equivalent pressure in ATM in the second field.',
      '3. Edit the ATM field to convert in reverse.',
      '4. Use Clear All Changes or Reload Calculator when you want empty fields again.',
      'Values update automatically; no Convert button is required. Keep both quantities on the same pressure reference (absolute-to-absolute or gauge-to-gauge).',
    ],
  },
  {
    id: 'psi-to-atm',
    title: 'How to Calculate Pressure in Atmospheres from PSI',
    paragraphs: [
      `1 psi ≈ ${formatPressure(ATM_PER_PSI)} atm because 1 psi = ${formatPressure(PASCALS_PER_PSI)} Pa and 1 atm = ${formatPressure(PASCALS_PER_ATM)} Pa.`,
      `Formula: atm = psi × ${formatPressure(ATM_PER_PSI)}.`,
      `Example; 30 psi: 30 × ${formatPressure(ATM_PER_PSI)} ≈ ${formatPressure(psiToAtm(30))} atm.`,
    ],
    formula: `atm = (psi × ${formatPressure(PASCALS_PER_PSI)}) ÷ ${formatPressure(PASCALS_PER_ATM)}\natm ≈ psi × ${formatPressure(ATM_PER_PSI)}`,
  },
  {
    id: 'atm-to-psi',
    title: 'How to Convert ATM to PSI',
    paragraphs: [
      `psi = atm × ${formatPressure(PSI_PER_ATM)}.`,
      `Example; 5 atm: 5 × ${formatPressure(PSI_PER_ATM)} ≈ ${formatPressure(atmToPsi(5))} psi.`,
      'The calculator handles both directions as you type.',
    ],
    formula: `psi = (atm × ${formatPressure(PASCALS_PER_ATM)}) ÷ ${formatPressure(PASCALS_PER_PSI)}\npsi ≈ atm × ${formatPressure(PSI_PER_ATM)}`,
  },
  {
    id: 'what-is-psi',
    title: 'What Is PSI?',
    paragraphs: [
      'PSI means pounds-force per square inch. It is widely used for tire pressure, hydraulic systems, and industrial pressure measurements.',
      'PSI is a pressure unit. The symbol alone does not specify whether a reading is gauge (psig) or absolute (psia).',
    ],
  },
  {
    id: 'what-is-atm',
    title: 'What Is an Atmosphere?',
    paragraphs: [
      `The standard atmosphere is a defined pressure unit equal to exactly ${formatPressure(PASCALS_PER_ATM)} Pascals.`,
      'It is common in chemistry, physics, and scientific calculations. Do not confuse the standard atmosphere with the actual local atmospheric pressure at your location.',
    ],
    formula: `1 atm = ${formatPressure(PASCALS_PER_ATM)} Pa ≈ ${formatPressure(PSI_PER_ATM)} psi`,
  },
  {
    id: 'conversion-table',
    title: 'PSI to ATM Conversion Table',
    paragraphs: [
      'Values generated from the same Pascal-base conversion engine used by the calculator. Displayed decimals are rounded for readability.',
    ],
    tableHeaders: ['PSI', 'ATM (approximately)'],
    table: TABLE_PSI.map((psi) => [formatPressure(psi), formatPressure(psiToAtm(psi))]),
  },
  {
    id: 'gauge-vs-absolute',
    title: 'Gauge Pressure vs Absolute Pressure',
    paragraphs: [
      'PSIG is gauge pressure relative to the surrounding atmosphere. PSIA is absolute pressure relative to a perfect vacuum.',
      'Direct PSI-to-ATM unit conversion preserves the supplied pressure reference. This calculator does not add 1 atm automatically.',
      'For gauge-to-absolute conversion between PSIG and PSIA, use a dedicated gauge/absolute converter when available in the catalog.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Pressure Unit Conversion, Pascal Conversion, Pa to PSI Converter, MPa to PSI Conversion, mmHg to ATM Conversion, PSI Converter, Bar to PSI Conversion, and kPa to PSI Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PSI_TO_ATM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert PSI to ATM?',
    answer: `Multiply PSI by approximately ${formatPressure(ATM_PER_PSI)}. For example, 100 psi ≈ ${formatPressure(psiToAtm(100))} atm.`,
  },
  {
    question: 'What Is the Equivalent Pressure in PSI for 1 ATM?',
    answer: `One standard atmosphere equals approximately ${formatPressure(PSI_PER_ATM)} PSI.`,
  },
  {
    question: 'How Many Atmospheres Is 30 PSI?',
    answer: `30 × ${formatPressure(ATM_PER_PSI)} ≈ ${formatPressure(psiToAtm(30))} atm.`,
  },
  {
    question: 'Is 14.7 PSI Equal to 1 ATM?',
    answer: `14.7 PSI is a common approximation of one standard atmosphere. The more precise conversion is approximately ${formatPressure(PSI_PER_ATM)} PSI per ATM.`,
  },
  {
    question: 'Can I Convert ATM Back to PSI?',
    answer: `Yes. Multiply the number of atmospheres by approximately ${formatPressure(PSI_PER_ATM)}.`,
  },
  {
    question: 'Does PSI to ATM Conversion Depend on Temperature?',
    answer:
      'Converting a given pressure value between PSI and ATM does not require temperature. Temperature can affect the physical pressure of a gas, but it does not change the fixed conversion factor between the two units.',
  },
  {
    question: 'Is PSI the Same as PSIG?',
    answer:
      'No. PSI identifies a pressure unit, while PSIG explicitly refers to gauge pressure.',
  },
  {
    question: 'Can Pressure Be Negative?',
    answer:
      'Gauge pressure can be negative relative to the surrounding atmosphere. Absolute pressure cannot be negative. This calculator performs numerical unit conversion and allows signed inputs for mathematical completeness.',
  },
];
