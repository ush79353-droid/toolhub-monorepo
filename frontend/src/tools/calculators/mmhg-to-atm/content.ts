import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  atmToMmHg,
  formatPressure,
  mmHgToAtm,
  MMHG_PER_ATM,
} from './calculation';

export const MMHG_ATM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mmHg to atm Conversion' },
  { id: 'mmhg-to-atm', label: 'What Is the Conversion from mmHg to atm?' },
  { id: 'atm-to-mmhg', label: 'Reverse Conversion — atm to mmHg' },
  { id: 'examples', label: 'How to Convert mmHg to atm — Examples' },
  { id: 'how-to-use', label: 'How to Use the mmHg to atm Calculator' },
  { id: 'conversion-table', label: 'mmHg to atm Conversion Table' },
  { id: 'related-tools', label: 'Other Related Pressure Converters' },
  { id: 'mmhg-atm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MMHG = [76, 152, 380, 475, 760, 1520, 2280, 3800] as const;

export const MMHG_ATM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mmHg to atm Conversion',
    paragraphs: [
      'Convert pressure between millimeters of mercury (mmHg) and standard atmospheres (atm). The calculator is useful for physics, chemistry, laboratory work, gas-law problems, and atmospheric-pressure calculations. It converts numerical pressure units only — it does not add or subtract atmospheric pressure for gauge ↔ absolute conversion.',
    ],
  },
  {
    id: 'mmhg-to-atm',
    title: 'What Is the Conversion from mmHg to atm?',
    paragraphs: [
      `This tool uses the conventional relationship ${MMHG_PER_ATM} mmHg = 1 atm (the same 760 factor used for Torr). Standard atmosphere is exactly 101,325 Pa.`,
      `To convert mmHg to atm: atm = mmHg ÷ ${MMHG_PER_ATM}.`,
      `Example: 380 mmHg ÷ ${MMHG_PER_ATM} = ${formatPressure(mmHgToAtm(380))} atm.`,
    ],
    formula: `${MMHG_PER_ATM} mmHg = 1 atm\natm = mmHg ÷ ${MMHG_PER_ATM}\n380 mmHg = 0.5 atm`,
  },
  {
    id: 'atm-to-mmhg',
    title: 'Reverse Conversion — atm to mmHg',
    paragraphs: [
      `Multiply atmospheres by ${MMHG_PER_ATM}: mmHg = atm × ${MMHG_PER_ATM}.`,
      `Example: 3 atm × ${MMHG_PER_ATM} = ${formatPressure(atmToMmHg(3))} mmHg.`,
      'Reverse conversion is useful when a source lists pressure in atmospheres and you need a mercury-column scale.',
    ],
    formula: `mmHg = atm × ${MMHG_PER_ATM}\n3 atm = 2280 mmHg`,
  },
  {
    id: 'examples',
    title: 'How to Convert mmHg to atm — Examples',
    paragraphs: [
      `Example 1 — 610 mmHg: 610 ÷ ${MMHG_PER_ATM} ≈ ${formatPressure(mmHgToAtm(610))} atm.`,
      `Example 2 — 475 mmHg: 475 ÷ ${MMHG_PER_ATM} = ${formatPressure(mmHgToAtm(475))} atm.`,
      `Example 3 — 2 atm: 2 × ${MMHG_PER_ATM} = ${formatPressure(atmToMmHg(2))} mmHg.`,
    ],
    formula: `610 ÷ 760 ≈ ${formatPressure(mmHgToAtm(610))} atm\n475 ÷ 760 = 0.625 atm\n2 × 760 = 1520 mmHg`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mmHg to atm Calculator',
    paragraphs: [
      '1. Enter a pressure value in mmHg.',
      '2. Read the equivalent value in atm instantly.',
      '3. Alternatively, enter atm to obtain mmHg.',
      '4. Expand Other pressure units for Pa, kPa, bar, psi, Torr, and related units.',
      '5. Share the result or clear the calculator when finished.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'mmHg to atm Conversion Table',
    paragraphs: [
      'Values below use the same conventional engine as the calculator (760 mmHg per atm).',
    ],
    tableHeaders: ['mmHg', 'atm'],
    table: TABLE_MMHG.map((mmHg) => [formatPressure(mmHg), formatPressure(mmHgToAtm(mmHg))]),
  },
  {
    id: 'related-tools',
    title: 'Other Related Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Pressure Conversion, kPa Converter, kPa to atm Conversion, kPa to mmHg Conversion, kPa to PSI Conversion, Torr to atm Conversion, Bar to ATM Conversion, and ATM Conversion. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MMHG_ATM_FAQS: readonly FAQItem[] = [
  {
    question: 'Is 760 mmHg the Same as 1 atm?',
    answer: `Under the conventional pressure-conversion relationship used here, ${MMHG_PER_ATM} mmHg corresponds to one standard atmosphere. Torr is defined as 1/${MMHG_PER_ATM} of an atmosphere; CIPM conventional mmHg is a mercury-column definition and is extremely close but not formally identical.`,
  },
  {
    question: 'What Is 475 mmHg Expressed in atm?',
    answer: `475 ÷ ${MMHG_PER_ATM} = ${formatPressure(mmHgToAtm(475))} atm.`,
  },
  {
    question: 'How Many mmHg Are in 2 atm?',
    answer: `2 × ${MMHG_PER_ATM} = ${formatPressure(atmToMmHg(2))} mmHg.`,
  },
  {
    question: 'What Is 610 mmHg in atm?',
    answer: `610 ÷ ${MMHG_PER_ATM} ≈ ${formatPressure(mmHgToAtm(610))} atm.`,
  },
  {
    question: 'How Do I Convert atm to mmHg?',
    answer: `Multiply the pressure in atmospheres by ${MMHG_PER_ATM}.`,
  },
  {
    question: 'What Is the Difference Between mmHg and Torr?',
    answer:
      'Torr is defined as one seven-hundred-sixtieth of a standard atmosphere. The formal millimeter-of-mercury unit is based on a mercury-column pressure definition (CIPM). Their values are extremely close and are commonly treated as equivalent for many practical calculations, but they are not identical under every formal definition.',
  },
];
