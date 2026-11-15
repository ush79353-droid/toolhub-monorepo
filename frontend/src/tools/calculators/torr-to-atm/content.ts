import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  atmospheresToTorr,
  formatPressure,
  torrToAtmospheres,
} from './calculation';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_TORR,
  TORR_PER_ATMOSPHERE,
} from './types';

export const TORR_TO_ATM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-torr', label: 'What Is Torr?' },
  { id: 'what-is-atm', label: 'What Is an Atmosphere?' },
  { id: 'how-many-torr', label: 'How Many Torr in 1 atm?' },
  { id: 'torr-to-atm-formula', label: 'Torr to atm Formula' },
  { id: 'atm-to-torr-formula', label: 'atm to Torr Formula' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'other-units', label: 'Torr to Other Units' },
  { id: 'applications', label: 'Applications' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'torr-to-atm-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  left: string;
  right: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableHeaders?: readonly [string, string];
  tableNote?: string;
}

const TABLE_TORR = [
  0, 1, 5, 10, 50, 100, 200, 380, 500, 760, 1000, 1520, 2280, 3800, 7600,
] as const;

export const TORR_TO_ATM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Torr and the standard atmosphere (atm) are pressure units. This converter turns Torr into atmospheres and atmospheres into Torr as you type, using the exact definition 1 atm = 760 Torr.',
      'Pressure is force per unit area. The SI unit is the pascal (Pa). The standard atmosphere is defined exactly as 101325 Pa, and the torr is defined as 1/760 of that atmosphere. Instant conversion helps vacuum work, lab notes, and mixed unit datasets stay consistent.',
    ],
  },
  {
    id: 'what-is-torr',
    title: 'Torr Unit: Is Torr Equivalent to mmHg?',
    paragraphs: [
      'Torr is a pressure unit named after Evangelista Torricelli. By definition, 1 Torr equals exactly 1/760 of a standard atmosphere, so 1 Torr = 101325/760 Pa.',
      'Millimeters of mercury (mmHg) describe a conventional mercury-column pressure. Torr and conventional mmHg are numerically extremely close, but they are not the same definition. Precision work should keep them distinct.',
      'Torr appears often in vacuum systems, laboratory measurements, scientific experiments, low-pressure process control, and industrial instrumentation.',
    ],
    formula: `1 Torr = 101325 / 760 Pa ≈ ${formatPressure(PASCALS_PER_TORR)} Pa`,
  },
  {
    id: 'what-is-atm',
    title: 'What Is an Atmosphere?',
    paragraphs: [
      'The standard atmosphere (symbol atm) is a fixed pressure unit defined exactly as 101325 Pa. It is a common reference for atmospheric and absolute pressure scales in science and engineering.',
      `Because 1 atm equals exactly ${TORR_PER_ATMOSPHERE} Torr, converting between these two units is a simple scale factor with no approximate constant required.`,
    ],
    formula: `1 atm = ${PASCALS_PER_ATM} Pa = ${TORR_PER_ATMOSPHERE} Torr`,
  },
  {
    id: 'how-many-torr',
    title: 'How Many Torr Are in 1 atm?',
    paragraphs: [
      `Exactly ${TORR_PER_ATMOSPHERE} Torr. Examples: 0.5 atm = ${atmospheresToTorr(0.5)} Torr; 2 atm = ${atmospheresToTorr(2)} Torr; 3 atm = ${atmospheresToTorr(3)} Torr.`,
    ],
    formula: `1 atm = ${TORR_PER_ATMOSPHERE} Torr`,
  },
  {
    id: 'torr-to-atm-formula',
    title: 'Torr to atm Formula',
    paragraphs: [
      `Divide Torr by ${TORR_PER_ATMOSPHERE}. Example: 500 Torr ÷ ${TORR_PER_ATMOSPHERE} ≈ ${formatPressure(torrToAtmospheres(500))} atm.`,
    ],
    formula: `atm = Torr / ${TORR_PER_ATMOSPHERE}`,
  },
  {
    id: 'atm-to-torr-formula',
    title: 'atm to Torr Formula',
    paragraphs: [
      `Multiply atmospheres by ${TORR_PER_ATMOSPHERE}. Example: 2.5 atm × ${TORR_PER_ATMOSPHERE} = ${atmospheresToTorr(2.5)} Torr.`,
    ],
    formula: `Torr = atm × ${TORR_PER_ATMOSPHERE}`,
  },
  {
    id: 'conversion-table',
    title: 'Conversion Table',
    paragraphs: [
      'Selected Torr values converted with the exact 760 ratio. Non-exact decimal atmospheres shown here are rounded for reading; the calculator keeps full internal precision.',
    ],
    tableHeaders: ['Torr', 'Atmospheres (atm)'],
    table: TABLE_TORR.map((torr) => ({
      left: formatPressure(torr),
      right: formatPressure(torrToAtmospheres(torr)),
    })),
    tableNote: `Exact: 1 atm = ${TORR_PER_ATMOSPHERE} Torr. Rounded decimals are approximate.`,
  },
  {
    id: 'other-units',
    title: 'Torr to Other Pressure Units',
    paragraphs: [
      'Expand Conversion to other units to see the same pressure in pascals, kilopascals, megapascals, bars, millibars, psi, conventional mmHg, and inches of mercury.',
      'Those rows use the shared Pressure Conversion engine with pascal as the canonical intermediate. Torr↔atm in the primary fields still uses the direct exact ratio of 760.',
    ],
  },
  {
    id: 'applications',
    title: 'Applications of Torr and atm',
    paragraphs: [
      'Torr and atm conversion supports vacuum engineering, laboratory pressure logs, industrial pressure systems, atmospheric science references, gas-law problems, chemistry and physics experiments, and scientific instrumentation that mixes SI and atmospheric units.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      '1. Enter pressure in Torr and read atmospheres, or enter atmospheres and read Torr.',
      '2. Both primary fields are editable; the last-edited field is the source.',
      '3. Expand Conversion to other units for Pa, kPa, MPa, bar, mbar, psi, mmHg, and inHg.',
      '4. Copy or share the result, reload to restore the demo (760 Torr = 1 atm), or clear all changes.',
    ],
  },
];

export const TORR_TO_ATM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert Torr to atm?',
    answer: `Divide the pressure in Torr by ${TORR_PER_ATMOSPHERE}.`,
  },
  {
    question: 'How many Torr are in one atmosphere?',
    answer: `Exactly ${TORR_PER_ATMOSPHERE} Torr.`,
  },
  {
    question: 'Is 760 Torr equal to 1 atm?',
    answer: 'Yes. Exactly.',
  },
  {
    question: 'How many atm is 380 Torr?',
    answer: `${formatPressure(torrToAtmospheres(380))} atm.`,
  },
  {
    question: 'How many atm is 100 Torr?',
    answer: `Approximately ${formatPressure(torrToAtmospheres(100))} atm.`,
  },
  {
    question: 'How many Torr is 2 atm?',
    answer: `${atmospheresToTorr(2)} Torr.`,
  },
  {
    question: 'How do I convert atm to Torr?',
    answer: `Multiply atmospheres by ${TORR_PER_ATMOSPHERE}.`,
  },
  {
    question: 'Is Torr the same as mmHg?',
    answer:
      'They are extremely close numerically but use different definitions. Do not treat them as identical in precision-sensitive calculations.',
  },
  {
    question: 'What is Torr used for?',
    answer:
      'Torr is commonly used for vacuum measurements, laboratory experiments, and low-pressure systems.',
  },
  {
    question: 'What is atmospheric pressure in Torr?',
    answer: `One standard atmosphere equals exactly ${TORR_PER_ATMOSPHERE} Torr.`,
  },
  {
    question: 'What is atmospheric pressure in pascals?',
    answer: `One standard atmosphere equals exactly ${PASCALS_PER_ATM} Pa.`,
  },
  {
    question: 'What is 1 Torr in pascals?',
    answer: `Approximately ${formatPressure(PASCALS_PER_TORR)} Pa (exactly 101325/760 Pa).`,
  },
  {
    question: 'How many Torr are in 0.25 atm?',
    answer: `${atmospheresToTorr(0.25)} Torr.`,
  },
  {
    question: 'How many Torr are in 5 atm?',
    answer: `${atmospheresToTorr(5)} Torr.`,
  },
  {
    question: 'Can pressure values be negative?',
    answer:
      'Absolute pressure cannot be negative, but signed gauge pressures and pressure differences may be negative depending on the reference. This converter preserves the sign.',
  },
  {
    question: 'What is the SI unit of pressure?',
    answer: 'The pascal (Pa).',
  },
  {
    question: 'What is the relationship between Torr and bar?',
    answer:
      'Convert using the exact definitions: 1 Torr = 101325/760 Pa and 1 bar = 100000 Pa, or expand the other-units section after entering Torr or atm.',
  },
];
