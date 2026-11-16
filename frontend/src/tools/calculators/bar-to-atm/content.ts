import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { atmToBar, barToAtm, formatPressure } from './calculation';
import { BAR_PER_ATM, PA_PER_ATM, PA_PER_BAR } from './types';

export const BAR_TO_ATM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'bar-to-atm-conversion', label: 'Bar to ATM Conversion' },
  { id: 'how-to-convert-bar-to-atm', label: 'How to Convert Bar to ATM' },
  { id: 'how-to-use-bar-to-atm', label: 'How to Use This Bar to ATM Conversion Tool' },
  { id: 'bar-to-atm-table', label: 'Bar to ATM Conversion Table' },
  { id: 'similar-tools', label: 'Our Similar Tools' },
  { id: 'bar-to-atm-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_BAR = [0.1, 0.5, 1, 2, 3, 5, 10, 20, 50, 100] as const;

export const BAR_TO_ATM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'bar-to-atm-conversion',
    title: 'Bar to ATM Conversion',
    paragraphs: [
      `The bar is a metric-derived pressure unit equal to ${PA_PER_BAR.toLocaleString('en-US')} Pa. It is convenient for engineering but is not an SI unit. The standard atmosphere (atm) is a defined reference equal to exactly ${PA_PER_ATM.toLocaleString('en-US')} Pa — close to typical sea-level air pressure, not a guarantee that every location always measures 1 atm.`,
      `Because ${PA_PER_BAR.toLocaleString('en-US')} Pa is slightly less than ${PA_PER_ATM.toLocaleString('en-US')} Pa, 1 bar ≈ ${formatPressure(barToAtm(1))} atm, and 1 atm = ${BAR_PER_ATM} bar.`,
    ],
    formula: `1 bar = ${PA_PER_BAR.toLocaleString('en-US')} Pa  |  1 atm = ${PA_PER_ATM.toLocaleString('en-US')} Pa  |  1 bar ≈ ${formatPressure(barToAtm(1))} atm`,
  },
  {
    id: 'how-to-convert-bar-to-atm',
    title: 'How to Convert Bar to ATM',
    paragraphs: [
      `Use atm = bar × (${PA_PER_BAR} / ${PA_PER_ATM}). Example: 3 bar → 3 × (${PA_PER_BAR} / ${PA_PER_ATM}) ≈ ${formatPressure(barToAtm(3))} atm.`,
      `Reverse: bar = atm × ${BAR_PER_ATM}. Example: 5 atm × ${BAR_PER_ATM} = ${formatPressure(atmToBar(5))} bar.`,
    ],
    formula: `atm = bar × (${PA_PER_BAR} / ${PA_PER_ATM})  |  bar = atm × ${BAR_PER_ATM}`,
  },
  {
    id: 'how-to-use-bar-to-atm',
    title: 'How to Use This Bar to ATM Conversion Tool',
    paragraphs: [
      '1. Enter the pressure in bar. 2. View the equivalent pressure in atmospheres. 3. Or enter atmospheres to calculate bar. 4. Swap field order if you prefer atm first. 5. Use Share Result to copy values. 6. Use Reload Calculator or Clear All Changes to reset. Results update automatically.',
    ],
  },
  {
    id: 'bar-to-atm-table',
    title: 'Bar to ATM Conversion Table',
    paragraphs: [
      'Displayed values are rounded. The calculator uses exact Pa definitions internally.',
    ],
    tableHeaders: ['Bar', 'Atmospheres'],
    table: TABLE_BAR.map((bar) => [formatPressure(bar), formatPressure(barToAtm(bar))]),
  },
  {
    id: 'similar-tools',
    title: 'Our Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages include ATM Conversion, ATM to Pascals Conversion, Barometric Pressure Conversion, Pressure Conversion, and Torr to ATM Conversion.',
    ],
  },
];

export const BAR_TO_ATM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Bars Are Present in 1 ATM?',
    answer: `1 atm = ${BAR_PER_ATM} bar.`,
  },
  {
    question: 'How Can I Convert 12 Bars to ATM?',
    answer: `atm = 12 × (${PA_PER_BAR} / ${PA_PER_ATM}) ≈ ${formatPressure(barToAtm(12))} atm.`,
  },
  {
    question: 'Is 1 Bar Equal to 1 ATM?',
    answer: `No. 1 bar is slightly smaller than 1 standard atmosphere: 1 bar ≈ ${formatPressure(barToAtm(1))} atm.`,
  },
  {
    question: 'What Is the Difference Between Bar and ATM?',
    answer: `Both measure pressure but at different defined magnitudes: 1 bar = ${PA_PER_BAR.toLocaleString('en-US')} Pa and 1 atm = ${PA_PER_ATM.toLocaleString('en-US')} Pa.`,
  },
  {
    question: 'How Do I Convert ATM to Bar?',
    answer: `bar = atm × ${BAR_PER_ATM}.`,
  },
  {
    question: 'What Is 2.5 Bar in ATM?',
    answer: `2.5 × (${PA_PER_BAR} / ${PA_PER_ATM}) ≈ ${formatPressure(barToAtm(2.5))} atm.`,
  },
];
