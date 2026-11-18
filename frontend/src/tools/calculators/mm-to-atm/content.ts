import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { atmToMmHg, formatPressure, mmHgToAtm, MMHG_PER_ATM } from './calculation';

export const MM_TO_ATM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mm to ATM Converter' },
  { id: 'how-it-works', label: 'How Does the mmHg to ATM Conversion Work?' },
  { id: 'formula', label: 'mmHg to atm Conversion Formula' },
  { id: 'reverse', label: 'How to Convert atm to mmHg' },
  { id: 'conversion-table', label: 'mmHg to atm Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the mm to ATM Converter' },
  { id: 'practical-uses', label: 'Practical Uses of mmHg to atm Conversion' },
  { id: 'related-tools', label: 'Other Related Pressure Converters' },
  { id: 'mm-to-atm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MMHG = [1, 10, 50, 100, 150, 380, 475, 760, 1000, 1520] as const;

export const MM_TO_ATM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mm to ATM Converter',
    paragraphs: [
      'Convert pressure from millimeters of mercury (mmHg) to standard atmospheres (atm), and the reverse. Despite the catalog name “mm to ATM,” this tool uses mmHg — a pressure unit — not millimeters of length.',
      'It is useful for laboratory readings, gas-law problems, atmospheric comparisons, and educational calculations. It converts numerical pressure units only and does not diagnose medical conditions or switch absolute vs gauge reference.',
    ],
  },
  {
    id: 'how-it-works',
    title: 'How Does the mmHg to ATM Conversion Work?',
    paragraphs: [
      'Pressure describes force per unit area. Millimeters of mercury (mmHg) historically relate to the height of a mercury column under gravity. One standard atmosphere (atm) is defined as exactly 101,325 Pa.',
      `Common pressure tools use the rounded relationship ${MMHG_PER_ATM} mmHg ≈ 1 atm (the same 760 factor used for Torr). CIPM conventional mmHg is extremely close but not formally identical to Torr.`,
      'Millimeters of mercury (mmHg): used in blood-pressure style readings, lab instruments, vacuum work, and medical equipment. A value such as 120 mmHg is a pressure, not a length of 120 mm.',
      'Atmospheres (atm): a convenient reference for chemistry, gas laws, experiments, and engineering pressure comparisons. Exactly 1 atm = 101,325 Pa.',
    ],
    formula: `1 atm = 101325 Pa\n1 atm ≈ ${MMHG_PER_ATM} mmHg (conventional)`,
  },
  {
    id: 'formula',
    title: 'mmHg to atm Conversion Formula',
    paragraphs: [
      `atm = mmHg ÷ ${MMHG_PER_ATM}. Divide the mmHg reading by ${MMHG_PER_ATM} to obtain atmospheres.`,
      `Example — 150 mmHg: 150 ÷ ${MMHG_PER_ATM} ≈ ${formatPressure(mmHgToAtm(150))} atm.`,
      `Example — 475 mmHg: 475 ÷ ${MMHG_PER_ATM} = ${formatPressure(mmHgToAtm(475))} atm.`,
      `Example — 760 mmHg: 760 ÷ ${MMHG_PER_ATM} = ${formatPressure(mmHgToAtm(760))} atm.`,
    ],
    formula: `atm = mmHg ÷ ${MMHG_PER_ATM}\n150 mmHg ≈ ${formatPressure(mmHgToAtm(150))} atm\n760 mmHg = 1 atm`,
  },
  {
    id: 'reverse',
    title: 'How to Convert atm to mmHg',
    paragraphs: [
      `mmHg = atm × ${MMHG_PER_ATM}. Multiply atmospheres by ${MMHG_PER_ATM}.`,
      `Examples: 0.5 atm = ${formatPressure(atmToMmHg(0.5))} mmHg; 1 atm = ${formatPressure(atmToMmHg(1))} mmHg; 2.5 atm = ${formatPressure(atmToMmHg(2.5))} mmHg; 3 atm = ${formatPressure(atmToMmHg(3))} mmHg.`,
    ],
    formula: `mmHg = atm × ${MMHG_PER_ATM}\n0.5 atm = 380 mmHg\n3 atm = 2280 mmHg`,
  },
  {
    id: 'conversion-table',
    title: 'mmHg to atm Conversion Table',
    paragraphs: [
      'Values use the same conventional engine as the calculator (760 mmHg per atm).',
    ],
    tableHeaders: ['mmHg', 'atm'],
    table: TABLE_MMHG.map((mmHg) => [formatPressure(mmHg), formatPressure(mmHgToAtm(mmHg))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mm to ATM Converter',
    paragraphs: [
      '1. Enter pressure in mmHg.',
      '2. Read the equivalent pressure in atm.',
      '3. Alternatively, enter atm to convert back into mmHg.',
      '4. Change either field to compare different pressures.',
      '5. Share or clear the calculator when finished.',
    ],
  },
  {
    id: 'practical-uses',
    title: 'Practical Uses of mmHg to atm Conversion',
    paragraphs: [
      'Typical uses include laboratory pressure readings, gas-law homework, atmospheric comparisons, and converting medical-style mmHg figures into atmospheres for scientific context. This converter does not provide medical diagnosis or treatment advice.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Pressure Conversion, kPa to atm Conversion, kPa to mmHg Conversion, mmHg to atm Conversion, Torr to atm Conversion, Bar to ATM Conversion, and PSI converters. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MM_TO_ATM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert mmHg to ATM?',
    answer: `Divide the pressure in mmHg by ${MMHG_PER_ATM}: atm = mmHg ÷ ${MMHG_PER_ATM}.`,
  },
  {
    question: 'What Is the ATM if the Pressure Is 150 mmHg?',
    answer: `150 ÷ ${MMHG_PER_ATM} ≈ ${formatPressure(mmHgToAtm(150))} atm.`,
  },
  {
    question: 'Is 760 mmHg Equal to 1 atm?',
    answer: `Yes, under the standard simplified conversion used here (${MMHG_PER_ATM} mmHg ≈ 1 atm). One standard atmosphere is exactly 760 torr; conventional mmHg is extremely close to a torr.`,
  },
  {
    question: 'Why Is ATM Used as a Unit of Pressure?',
    answer:
      'The standard atmosphere is a convenient reference pressure for scientific calculations and comparisons, anchored at exactly 101,325 Pa.',
  },
  {
    question: 'What Is the Difference Between mm and mmHg?',
    answer:
      'Millimeters (mm) measure length. Millimeters of mercury (mmHg) measure pressure. They are different physical quantities and cannot be converted into one another directly.',
  },
  {
    question: 'Where Is mmHg Commonly Used?',
    answer:
      'mmHg is widely used in blood-pressure style readings and many laboratory pressure measurements.',
  },
];
