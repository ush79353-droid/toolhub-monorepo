import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  INH2O_PER_PSI,
  PASCALS_PER_INH2O,
  PASCALS_PER_PSI,
  PSI_PER_INH2O,
  formatPressure,
  inH2OToPsi,
  psiToInH2O,
} from './calculation';

export const PSI_TO_INCHES_OF_WATER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'PSI to Inches of Water Conversion' },
  { id: 'how-to-use', label: 'How to Use the PSI to Inches of Water Conversion Tool' },
  { id: 'formula', label: 'PSI to Inches of Water Formula' },
  { id: 'example-8-psi', label: 'Converting 8 PSI to Inches of Water' },
  { id: 'what-is-psi', label: 'What Is PSI?' },
  { id: 'what-are-inches-of-water', label: 'What Are Inches of Water?' },
  { id: 'water-temperature', label: 'Why Does Water Temperature Matter?' },
  { id: 'conversion-table', label: 'PSI to Inches of Water Conversion Table' },
  { id: 'related-converters', label: 'More Pressure Conversion Tools' },
  { id: 'psi-to-inches-of-water-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_PSI = [0, 1, 2, 5, 8, 10, 15, 20, 30, 50, 100] as const;

export const PSI_TO_INCHES_OF_WATER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'PSI to Inches of Water Conversion',
    paragraphs: [
      'PSI (pounds-force per square inch) is a common customary pressure unit. Inches of water (inH₂O) express pressure as the height of a water column and are widely used for low-pressure HVAC, ventilation, and differential-pressure work.',
      'Technicians convert between these units when equipment ratings, sensor datasheets, or field instruments use different scales. This interactive calculator updates both directions as you type and uses one documented water-column convention throughout.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the PSI to Inches of Water Conversion Tool',
    paragraphs: [
      '1. Enter a pressure value in PSI in the first field.',
      '2. Read the equivalent inches of water in the second field.',
      '3. Edit the inches-of-water field to convert in reverse.',
      '4. Use Clear All Changes or Reload Calculator when you want empty fields again.',
      'Values update automatically — no Convert button is required. Keep both quantities on the same pressure reference (absolute-to-absolute or gauge-to-gauge).',
    ],
  },
  {
    id: 'formula',
    title: 'PSI to Inches of Water Formula',
    paragraphs: [
      `This site uses the conventional inches-of-water definition at 4 °C: ρ = 1000 kg/m³ with standard gravity g₀, so 1 inH₂O = ${formatPressure(PASCALS_PER_INH2O)} Pa. International pound-force per square inch uses 1 psi = ${formatPressure(PASCALS_PER_PSI)} Pa.`,
      `Therefore inH₂O = psi × ${formatPressure(INH2O_PER_PSI)}, and psi = inH₂O × ${formatPressure(PSI_PER_INH2O)}.`,
      'Do not mix this factor with charts that use a different water temperature or density convention.',
    ],
    formula: `inH₂O = (psi × ${formatPressure(PASCALS_PER_PSI)}) ÷ ${formatPressure(PASCALS_PER_INH2O)}\ninH₂O ≈ psi × ${formatPressure(INH2O_PER_PSI)}\n\npsi = (inH₂O × ${formatPressure(PASCALS_PER_INH2O)}) ÷ ${formatPressure(PASCALS_PER_PSI)}\npsi ≈ inH₂O × ${formatPressure(PSI_PER_INH2O)}`,
  },
  {
    id: 'example-8-psi',
    title: 'Converting 8 PSI to Inches of Water',
    paragraphs: [
      `Under the 4 °C convention, multiply 8 by ${formatPressure(INH2O_PER_PSI)}.`,
      `8 × ${formatPressure(INH2O_PER_PSI)} ≈ ${formatPressure(psiToInH2O(8))} inH₂O.`,
      'The calculator uses the same precise Pascal-base factors internally and rounds only for display.',
    ],
    formula: `8 psi × ${formatPressure(INH2O_PER_PSI)} ≈ ${formatPressure(psiToInH2O(8))} inH₂O`,
  },
  {
    id: 'what-is-psi',
    title: 'What Is PSI?',
    paragraphs: [
      'PSI means pounds-force per square inch. It is commonly used for tire inflation, fluid systems, and industrial equipment ratings.',
      'The unit alone does not state whether a reading is gauge (relative to ambient air) or absolute (relative to vacuum). Keep that reference consistent when converting numerical values.',
    ],
  },
  {
    id: 'what-are-inches-of-water',
    title: 'What Are Inches of Water?',
    paragraphs: [
      'Inches of water is a pressure unit based on the hydrostatic pressure of a water column one inch high under a chosen density and gravity convention.',
      'It is frequently used for low-pressure measurements in HVAC systems, ventilation ducts, differential-pressure instruments, and some gas-pressure applications.',
      'The numerical conversion factor depends on the adopted reference convention — this calculator documents and uses the 4 °C definition above.',
    ],
  },
  {
    id: 'water-temperature',
    title: 'Why Does Water Temperature Matter?',
    paragraphs: [
      'Water density changes with temperature, so a water-column-based pressure definition depends on the reference density chosen by a standard or manufacturer.',
      'Published conversion tables can therefore disagree slightly even when both are correct for their own convention.',
      'This converter does not infer water temperature from your inputs. It applies one fixed, documented 4 °C convention consistently in the calculator, formulas, tables, and FAQs.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'PSI to Inches of Water Conversion Table',
    paragraphs: [
      'Values generated from the same Pascal-base conversion engine used by the calculator (inH₂O at 4 °C). Displayed decimals are rounded for readability.',
    ],
    tableHeaders: ['PSI', 'inH₂O (approximately, 4 °C)'],
    table: TABLE_PSI.map((psi) => [formatPressure(psi), formatPressure(psiToInH2O(psi))]),
  },
  {
    id: 'related-converters',
    title: 'More Pressure Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include PSI Converter, Pressure Unit Conversion, PSI to ATM Conversion, Pa to PSI Converter, MPa to PSI Conversion, mmHg to ATM Conversion, Bar to PSI Conversion, kPa to PSI Conversion, and Pascal Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PSI_TO_INCHES_OF_WATER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 1 PSI in Inches of Water?',
    answer: `Under the stated 4 °C reference convention, 1 PSI is approximately ${formatPressure(INH2O_PER_PSI)} inches of water.`,
  },
  {
    question: 'How Much Is 4.1 PSI in Inches of Water?',
    answer: `4.1 × ${formatPressure(INH2O_PER_PSI)} ≈ ${formatPressure(psiToInH2O(4.1))} inH₂O.`,
  },
  {
    question: 'Can I Convert PSI to inH₂O?',
    answer: `Yes. Multiply PSI by approximately ${formatPressure(INH2O_PER_PSI)} for this site’s 4 °C inches-of-water convention, or use the interactive fields above.`,
  },
  {
    question: 'What Is 70 inH₂O Equal to in PSI?',
    answer: `psi = (70 × ${formatPressure(PASCALS_PER_INH2O)}) ÷ ${formatPressure(PASCALS_PER_PSI)} ≈ ${formatPressure(inH2OToPsi(70))} psi.`,
  },
  {
    question: 'Are Inches of Water and PSI the Same Measurement?',
    answer:
      'Both are units of pressure, but their numerical scales differ. One PSI is tens of inches of water under the convention used here.',
  },
  {
    question: 'Why Do Some PSI to Inches of Water Conversion Charts Differ?',
    answer:
      'Different water-column reference temperatures and standard-density conventions produce slightly different conversion factors. Compare charts only when they state the same convention.',
  },
  {
    question: 'What Is the Difference Between PSI and PSIG?',
    answer:
      'PSI denotes a pressure unit, while PSIG specifically identifies gauge pressure relative to ambient atmospheric pressure. This calculator converts numerical units and does not add atmosphere automatically.',
  },
];
