import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NATURAL_GAS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'units', label: 'Units to Measure Natural Gas' },
  { id: 'converter', label: 'Natural Gas Converter' },
  { id: 'units-chart', label: 'Natural Gas Units Chart' },
  { id: 'volume-to-energy', label: 'How to Convert Natural Gas Volume to Energy' },
  { id: 'energy-to-volume', label: 'How to Convert Natural Gas Energy to Volume' },
  { id: 'heating-varies', label: 'Why Natural Gas Heating Values Vary' },
  { id: 'formulas', label: 'Natural Gas Conversion Formulas' },
  { id: 'utility-bills', label: 'Natural Gas Usage and Utility Bills' },
  { id: 'examples-table', label: 'Natural Gas Conversion Examples' },
  { id: 'natural-gas-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const NATURAL_GAS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'units',
    title: 'Units to Measure Natural Gas',
    paragraphs: [
      'Natural gas is described with both volume and energy units. Volume units include cubic feet, CCF (100 ft³), MCF (1,000 ft³), cubic meters, liters, and related measures. Energy units include BTU, therms, MMBTU, kilowatt-hours, megajoules, and gigajoules.',
      'Utilities often meter delivered gas by volume but bill by energy so customers pay for heat content. Volume alone does not determine energy without a heating value.',
    ],
  },
  {
    id: 'converter',
    title: 'Natural Gas Converter',
    paragraphs: [
      'This converter handles volume-to-volume and volume-to-energy estimates. Pure volume changes (for example CCF to m³) use exact geometric factors. Volume-to-energy conversion multiplies cubic feet by a configurable heating value in BTU/ft³ (or an equivalent density such as MJ/m³).',
      'Example: 100 CCF at the illustrative heating value 1038 BTU/ft³ equals 103.8 therms. That heating value is an assumed default, not a property of all natural gas.',
    ],
  },
  {
    id: 'units-chart',
    title: 'Natural Gas Units Chart',
    paragraphs: [
      'Common volume equivalents (exact geometric definitions; no heating value applied):',
    ],
    tableHeaders: ['From', 'To', 'Factor'],
    table: [
      ['1 ft³', 'm³', '0.028316846592'],
      ['1 CCF', 'ft³', '100'],
      ['1 MCF', 'ft³', '1,000'],
      ['1 m³', 'ft³', '≈ 35.3146667'],
      ['1 L', 'm³', '0.001'],
      ['1 US gal', 'm³', '0.003785411784'],
    ],
  },
  {
    id: 'volume-to-energy',
    title: 'How to Convert Natural Gas Volume to Energy',
    paragraphs: [
      'Multiply volume in cubic feet by the heating value in BTU/ft³. Example: 250 ft³ × 1038 BTU/ft³ = 259,500 BTU. Therms = 259,500 ÷ 100,000 = 2.595.',
    ],
    formula: 'Energy (BTU) = Volume (ft³) × Heating Value (BTU/ft³)',
  },
  {
    id: 'energy-to-volume',
    title: 'How to Convert Natural Gas Energy to Volume',
    paragraphs: [
      'Convert energy to BTU, then divide by the heating value. Example: 5 therms = 500,000 BTU. At 1038 BTU/ft³, volume ≈ 500,000 ÷ 1038 ≈ 481.70 ft³.',
    ],
    formula: 'Volume (ft³) = Energy (BTU) / Heating Value (BTU/ft³)',
  },
  {
    id: 'heating-varies',
    title: 'Why Natural Gas Heating Values Vary',
    paragraphs: [
      'Methane content, other hydrocarbons, regional supply, gross versus net heating value, measurement conditions, and utility billing practices all affect energy density. Prefer the factor on your utility statement for billing work. This calculator exposes an adjustable heating value for transparent estimates.',
    ],
  },
  {
    id: 'formulas',
    title: 'Natural Gas Conversion Formulas',
    paragraphs: ['Core relationships used by the converter:'],
    formula:
      'E_BTU = V_ft³ × H_BTU/ft³ · V_ft³ = E_BTU / H · Therms = BTU / 100,000 · MMBTU = BTU / 1,000,000',
  },
  {
    id: 'utility-bills',
    title: 'Natural Gas Usage and Utility Bills',
    paragraphs: [
      'Meters typically record volume. Bills convert that volume using a published therm factor or heating value. Always check your statement: actual utility factors can differ from the illustrative 1038 BTU/ft³ default used here.',
    ],
  },
  {
    id: 'examples-table',
    title: 'Natural Gas Conversion Examples',
    paragraphs: [
      'Examples below use the illustrative heating value of 1038 BTU/ft³. Your utility’s factor may differ.',
    ],
    tableHeaders: ['Natural gas volume', 'Energy'],
    table: [
      ['1 ft³', '1,038 BTU'],
      ['10 ft³', '10,380 BTU'],
      ['100 ft³', '103,800 BTU'],
      ['1 CCF', '1.038 therms'],
      ['5 CCF', '5.19 therms'],
      ['10 CCF', '10.38 therms'],
      ['100 CCF', '103.8 therms'],
      ['1 MCF', '1.038 MMBTU'],
      ['5 MCF', '5.19 MMBTU'],
      ['10 MCF', '10.38 MMBTU'],
    ],
  },
];

export const NATURAL_GAS_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Unit Is Used to Measure Natural Gas?',
    answer:
      'Natural gas may be measured by volume (cubic feet or cubic meters) or by energy (BTU, therms, and related units).',
  },
  {
    question: 'What Is m³ in Natural Gas?',
    answer: 'm³ means cubic meter, an SI unit of volume.',
  },
  {
    question: 'How Many Cubic Feet Are in One Cubic Meter?',
    answer: '1 m³ ≈ 35.3147 ft³ (exact reciprocal of 0.028316846592 m³/ft³).',
  },
  {
    question: 'What Is CCF in Natural Gas?',
    answer: 'CCF means one hundred cubic feet.',
  },
  {
    question: 'What Is MCF in Natural Gas?',
    answer: 'MCF means one thousand cubic feet.',
  },
  {
    question: 'How Many Therms Are in One CCF?',
    answer:
      'Using an illustrative heating value of 1038 BTU/ft³: 1 CCF = 1.038 therms. The actual value depends on the gas heating value.',
  },
  {
    question: 'How Many BTU Are in One Cubic Foot of Natural Gas?',
    answer:
      'The heating value varies. This calculator uses 1038 BTU/ft³ as its adjustable default assumption.',
  },
  {
    question: 'How Can I Convert Natural Gas From ft³ to BTU?',
    answer: 'Multiply the volume in cubic feet by the heating value in BTU per cubic foot.',
  },
  {
    question: 'How Can I Convert BTU Back to Cubic Feet?',
    answer: 'Divide BTU by the gas heating value in BTU per cubic foot.',
  },
  {
    question: 'Is Natural Gas Volume Equal to Natural Gas Energy?',
    answer:
      'No. Volume and energy are different physical quantities. A heating value is required to convert between them.',
  },
];
