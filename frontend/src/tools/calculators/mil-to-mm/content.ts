import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, milToMm, mmToMil } from './calculation';
import { MM_PER_MIL, MILS_PER_MM } from './types';

export const MIL_MM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'whats-a-mil', label: "What's a Mil?" },
  { id: 'how-to-convert', label: 'How to Convert Mil to mm' },
  { id: 'worked-example', label: 'An Example Using the Mil to mm Converter' },
  { id: 'how-to-use', label: 'How to Use the Mil to mm Converter' },
  { id: 'conversion-table', label: 'Mil to Millimeter Conversion Table' },
  { id: 'related-tools', label: 'More Length Conversion Tools' },
  { id: 'mil-mm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_MILS = [1, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 200, 250, 500, 1000] as const;

export const MIL_MM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'whats-a-mil',
    title: "What's a Mil?",
    paragraphs: [
      'The mil to mm Conversion tool converts mils (thousandths of an inch, also called thou) to millimeters and back for engineering, manufacturing, PCB design, material thickness, precision machining, and industrial measurement.',
      'A mil is exactly one-thousandth of an international inch: 1 mil = 0.001 in.',
      `Because 1 inch = 25.4 mm exactly, 1 mil = ${MM_PER_MIL} mm.`,
      'A mil is not a millimeter, a statute mile, or an angular milliradian.',
    ],
    formula: `1 mil = 0.001 in\n1 in = 25.4 mm\n1 mil = ${MM_PER_MIL} mm`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Mil to mm',
    paragraphs: [
      'Start from 1 mil = 1/1000 inch and 1 inch = 25.4 mm.',
      `Therefore 1 mil = 25.4 / 1000 mm = ${MM_PER_MIL} mm.`,
      `Formula: mm = mil × ${MM_PER_MIL}. Reverse: mil = mm / ${MM_PER_MIL}.`,
      `Example: 7 mils × ${MM_PER_MIL} = 0.1778 mm.`,
      `Example: 50 mils × ${MM_PER_MIL} = 1.27 mm.`,
    ],
    formula: `mm = mil × ${MM_PER_MIL}\nmil = mm / ${MM_PER_MIL}\n7 × ${MM_PER_MIL} = 0.1778 mm\n50 × ${MM_PER_MIL} = 1.27 mm`,
  },
  {
    id: 'worked-example',
    title: 'An Example Using the Mil to mm Converter',
    paragraphs: [
      'To convert 12 mils into millimeters: enter 12 in the mil input. The calculator multiplies by the exact factor 0.0254.',
      `12 × ${MM_PER_MIL} = 0.3048 mm, so 12 mil = 0.3048 mm.`,
      `Reverse example: 2.54 ÷ ${MM_PER_MIL} = 100 mil.`,
    ],
    formula: `12 × ${MM_PER_MIL} = 0.3048 mm\n2.54 ÷ ${MM_PER_MIL} = 100 mil`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mil to mm Converter',
    paragraphs: [
      '1. Enter the value in mils in the first input field.',
      '2. View the automatically calculated value in millimeters.',
      '3. Alternatively, enter a value in millimeters.',
      '4. The equivalent value in mils is calculated instantly.',
      '5. Use Reload calculator to restore the initial state.',
      '6. Use Clear all changes to empty both fields.',
      '7. Use Share result to share the current conversion.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Mil to Millimeter Conversion Table',
    paragraphs: [
      `Common mil values converted with the exact factor 1 mil = ${MM_PER_MIL} mm.`,
    ],
    tableHeaders: ['Mils (mil)', 'Millimeters (mm)'],
    table: CHART_MILS.map((mil) => [String(mil), formatLength(milToMm(mil))]),
  },
  {
    id: 'related-tools',
    title: 'More Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include mil Conversion, mil to inch Conversion, Micron to Mil Conversion Calculator, Micrometer Converter, Millimeter Calculator, Inch Converter, Length Converter, Millimeter to Inch Converter, Micron Converter, and Centimeter Calculator. Only active catalog tools appear as live links.',
    ],
  },
];

export const MIL_MM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 5 Mil in mm?',
    answer: `5 × ${MM_PER_MIL} = 0.127 mm. Therefore 5 mil equals 0.127 millimeters.`,
  },
  {
    question: 'How Do I Convert mm to Mils?',
    answer: `Divide the millimeter measurement by ${MM_PER_MIL}. mil = mm / ${MM_PER_MIL}. For example, 1.27 ÷ ${MM_PER_MIL} = 50 mil.`,
  },
  {
    question: 'How Many Millimeters Are in One Mil?',
    answer: `Exactly ${MM_PER_MIL} millimeters.`,
  },
  {
    question: 'Is 1 Mil Equal to 1 mm?',
    answer: `No. One mil is ${MM_PER_MIL} mm, whereas 1 mm is approximately ${formatLength(mmToMil(1))} mils (exactly ${MILS_PER_MM} = 5000/127).`,
  },
  {
    question: 'What Is 10 Mil in Millimeters?',
    answer: `10 × ${MM_PER_MIL} = 0.254 mm.`,
  },
  {
    question: 'What Is 100 Mil in Millimeters?',
    answer: `100 × ${MM_PER_MIL} = 2.54 mm.`,
  },
  {
    question: 'What Is the Difference Between a Mil and a Millimeter?',
    answer: `A mil is 0.001 inch, while a millimeter is 0.001 meter. One millimeter is approximately ${formatLength(MILS_PER_MM)} mils.`,
  },
];
