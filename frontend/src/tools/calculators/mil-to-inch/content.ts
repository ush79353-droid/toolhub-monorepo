import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, milToInch } from './calculation';
import { INCHES_PER_MIL, MILS_PER_INCH, MM_PER_MIL } from './types';

export const MIL_INCH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'mils-per-inch', label: 'How Many Mils Are in an Inch?' },
  { id: 'how-to-convert', label: 'How Do I Convert Mils to Inches?' },
  { id: 'how-to-use', label: 'How to Use the Mil to Inch Converter' },
  { id: 'conversion-table', label: 'Mil to Inch Conversion Table' },
  { id: 'related-tools', label: 'Explore More Length Converters' },
  { id: 'mil-inch-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_MILS = [1, 5, 10, 20, 25, 50, 75, 100, 125, 200, 250, 500, 1000] as const;

export const MIL_INCH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'mils-per-inch',
    title: 'How Many Mils Are in an Inch?',
    paragraphs: [
      'The mil to inch Conversion tool converts mils (also called thousandths of an inch or thou) into inches and back. It is used in engineering, manufacturing, PCB design, material thickness, industrial measurement, and precision machining.',
      `Exactly ${MILS_PER_INCH} mils equal one international inch, so 1 mil = ${INCHES_PER_MIL} inch.`,
      'The name “thousandth of an inch” describes that exact ratio. A mil here is not a millimeter, a statute mile, or an angular milliradian.',
    ],
    formula: `1 in = ${MILS_PER_INCH} mil\n1 mil = ${INCHES_PER_MIL} in`,
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Mils to Inches?',
    paragraphs: [
      '1. Identify the measurement in mils.',
      '2. Divide by 1000.',
      '3. The result is the measurement in inches.',
      `Formula: inches = mils / ${MILS_PER_INCH}.`,
      `Example: 60 mils ÷ ${MILS_PER_INCH} = 0.06 inches.`,
      `Example: 250 mils ÷ ${MILS_PER_INCH} = 0.25 inches.`,
      `Reverse: mils = inches × ${MILS_PER_INCH}.`,
    ],
    formula: `inches = mils / ${MILS_PER_INCH}\nmils = inches × ${MILS_PER_INCH}\n60 ÷ ${MILS_PER_INCH} = 0.06 in\n250 ÷ ${MILS_PER_INCH} = 0.25 in`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mil to Inch Converter',
    paragraphs: [
      '1. Enter the number of mils in the first input field.',
      '2. The calculator immediately displays the equivalent measurement in inches.',
      '3. Alternatively, enter a measurement in inches.',
      '4. The equivalent value in mils appears automatically.',
      '5. Use Reload calculator to restore the initial state.',
      '6. Use Clear all changes to empty the fields.',
      '7. Use Share result to share a conversion.',
      'Example: Input 10 mil → Output 0.01 inch. The converter works in both directions.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Mil to Inch Conversion Table',
    paragraphs: [
      'Common mil values converted with the exact factor 1 mil = 0.001 in.',
    ],
    tableHeaders: ['Mils (mil)', 'Inches (in)'],
    table: CHART_MILS.map((mil) => [String(mil), formatLength(milToInch(mil))]),
  },
  {
    id: 'related-tools',
    title: 'Explore More Length Converters',
    paragraphs: [
      'Related Omega Calculators pages may include mil Conversion, Micron to Mil Conversion Calculator, Micrometer Converter, Inch Converter, Inch to Meter Calculator, Millimeter Calculator, Length Converter, Millimeter to Inch Converter, Micron Converter, and Centimeter Calculator. Only active catalog tools appear as live links.',
    ],
  },
];

export const MIL_INCH_FAQS: readonly FAQItem[] = [
  {
    question: 'How Thick Is 20 Mil in Inches?',
    answer: `20 mil equals 0.02 inches. 20 × ${INCHES_PER_MIL} = 0.02 in.`,
  },
  {
    question: 'Are Mils the Same as Miles?',
    answer:
      'No. A mil is a small length unit equal to one-thousandth of an inch, whereas a statute mile is a much larger distance unit equal to 5280 feet.',
  },
  {
    question: 'How Many Mils Are in One Inch?',
    answer: `There are exactly ${MILS_PER_INCH} mils in one inch.`,
  },
  {
    question: 'What Is 10 Mil in Inches?',
    answer: `10 mil = 0.01 inch.`,
  },
  {
    question: 'What Is 100 Mil in Inches?',
    answer: `100 mil = 0.1 inch.`,
  },
  {
    question: 'How Do I Convert Inches to Mils?',
    answer: `Multiply the number of inches by ${MILS_PER_INCH}. For example, 0.25 × ${MILS_PER_INCH} = 250 mil.`,
  },
  {
    question: 'Is a Mil the Same as a Millimeter?',
    answer: `No. One mil equals ${INCHES_PER_MIL} inch, or exactly ${MM_PER_MIL} millimeters. Therefore 1 mm ≈ ${formatLength(1 / MM_PER_MIL)} mil.`,
  },
];
