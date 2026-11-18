import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { atmToPascals, formatPressure, pascalsToAtm } from './calculation';
import { PA_PER_ATM } from './types';

export const ATM_TO_PASCALS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-atm-to-pascals', label: 'Convert atm to Pascals' },
  { id: 'atm-to-pascals-formula', label: 'atm to Pascals Formula' },
  { id: 'pa-to-atm-conversion', label: 'Pa to atm Conversion' },
  { id: 'other-pressure-converters', label: 'Other Pressure Converters' },
  { id: 'atm-to-pascals-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ATM = [0, 0.001, 0.01, 0.1, 0.5, 1, 1.5, 2, 2.5, 5, 7, 10, 20, 100] as const;

export const ATM_TO_PASCALS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-atm-to-pascals',
    title: 'Convert atm to Pascals',
    paragraphs: [
      'Atmospheric pressure is force from the air column per unit area. The standard atmosphere (atm) is a defined reference pressure used in science and engineering. The pascal (Pa) is the SI unit of pressure.',
      `By definition, 1 atm equals exactly ${PA_PER_ATM.toLocaleString('en-US')} Pa. Converting between them helps compare weather data, laboratory instruments, and engineering ratings that use different symbols.`,
      `Example: 0.8 atm × ${PA_PER_ATM.toLocaleString('en-US')} = ${formatPressure(atmToPascals(0.8))} Pa.`,
    ],
    formula: `1 atm = ${PA_PER_ATM.toLocaleString('en-US')} Pa`,
    tableHeaders: ['Atmospheres (atm)', 'Pascals (Pa)'],
    table: TABLE_ATM.map((atm) => [formatPressure(atm), formatPressure(atmToPascals(atm))]),
  },
  {
    id: 'atm-to-pascals-formula',
    title: 'atm to Pascals Formula',
    paragraphs: [
      `Pa = atm × ${PA_PER_ATM.toLocaleString('en-US')}, where Pa is pressure in pascals, atm is standard atmospheres, and ${PA_PER_ATM.toLocaleString('en-US')} is the exact conversion factor.`,
      `Example: 3 × ${PA_PER_ATM.toLocaleString('en-US')} = ${formatPressure(atmToPascals(3))} Pa.`,
    ],
    formula: `Pa = atm × ${PA_PER_ATM}`,
  },
  {
    id: 'pa-to-atm-conversion',
    title: 'Pa to atm Conversion',
    paragraphs: [
      `Reverse the relationship with atm = Pa ÷ ${PA_PER_ATM.toLocaleString('en-US')}.`,
      `Example: 3500 ÷ ${PA_PER_ATM.toLocaleString('en-US')} ≈ ${formatPressure(pascalsToAtm(3500))} atm.`,
      'Displayed answers may be rounded for readability; calculations use the exact factor internally.',
    ],
    formula: `atm = Pa ÷ ${PA_PER_ATM}`,
  },
  {
    id: 'other-pressure-converters',
    title: 'Other Pressure Converters',
    paragraphs: [
      'Related Omega Calculators pages that already exist include ATM Conversion, Pressure Conversion, Torr to ATM Conversion, and Lbs to PSI Converter.',
    ],
  },
];

export const ATM_TO_PASCALS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Can I Convert 20 atm to Pascals?',
    answer: `Pa = atm × ${PA_PER_ATM.toLocaleString('en-US')} = 20 × ${PA_PER_ATM.toLocaleString('en-US')} = ${formatPressure(atmToPascals(20))} Pa.`,
  },
  {
    question: 'Can I Convert 7 atm to Pascals?',
    answer: `Yes. 7 × ${PA_PER_ATM.toLocaleString('en-US')} = ${formatPressure(atmToPascals(7))} Pa.`,
  },
  {
    question: 'How Much Is 3500 Pascals in atm?',
    answer: `atm = 3500 ÷ ${PA_PER_ATM.toLocaleString('en-US')} ≈ ${formatPressure(pascalsToAtm(3500))} atm.`,
  },
  {
    question: 'How Many Pascals Are in One Atmosphere?',
    answer: `One standard atmosphere equals exactly ${PA_PER_ATM.toLocaleString('en-US')} pascals.`,
  },
  {
    question: 'What Is the Difference Between atm and Pa?',
    answer:
      'Both measure pressure. The pascal is the SI unit (1 Pa = 1 N/m²). The atmosphere is a larger defined unit commonly used for atmospheric and scientific comparisons.',
  },
  {
    question: 'What Is the Formula for Pressure?',
    answer:
      'Pressure = Force ÷ Area (P = F / A). In SI units, 1 Pa = 1 N/m².',
  },
];
