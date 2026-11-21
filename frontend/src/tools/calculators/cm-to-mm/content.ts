import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  centimetersToMillimeters,
  formatLength,
  millimetersToCentimeters,
} from './calculation';
import { MM_PER_CM } from './types';

export const CM_TO_MM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'centimeters-and-millimeters', label: 'Centimeters and Millimeters' },
  { id: 'conversion-from-cm-to-mm', label: 'The Conversion from CM to MM' },
  { id: 'worked-examples', label: 'Convert Centimeter to Millimeter: Worked Examples' },
  { id: 'how-to-use-tool', label: 'How to Use the CM to MM Converter' },
  { id: 'cm-to-mm-conversion-table', label: 'CM to MM Conversion Table' },
  { id: 'related-length-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'cm-to-mm-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_CM = [
  0, 0.1, 0.5, 1, 1.5, 2, 2.5, 5, 7.5, 9, 10, 15, 25, 50, 100, 250, 1000,
] as const;

export const CM_TO_MM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'centimeters-and-millimeters',
    title: 'Centimeters and Millimeters',
    paragraphs: [
      'Centimeters and millimeters are metric length units based on the meter. A centimeter is one hundredth of a meter (1 cm = 0.01 m). A millimeter is one thousandth of a meter (1 mm = 0.001 m).',
      `Because ${MM_PER_CM} millimeters fit in one centimeter, 1 cm = ${MM_PER_CM} mm exactly.`,
      'Millimeters suit precise measurements such as components and drawings. Centimeters are common for everyday lengths, schoolwork, and DIY projects.',
    ],
    formula: `1 cm = ${MM_PER_CM} mm = 0.01 m  ·  1 mm = 0.1 cm = 0.001 m`,
  },
  {
    id: 'conversion-from-cm-to-mm',
    title: 'The Conversion from CM to MM',
    paragraphs: [
      `Convert centimeters to millimeters by multiplying by ${MM_PER_CM}: mm = cm × ${MM_PER_CM}.`,
      `Example 1: 5 cm: 5 × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(5))} mm.`,
      `Example 2: 12.5 cm: 12.5 × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(12.5))} mm.`,
      `Convert millimeters to centimeters by dividing by ${MM_PER_CM}: cm = mm ÷ ${MM_PER_CM}. Example: 250 ÷ ${MM_PER_CM} = ${formatLength(millimetersToCentimeters(250))} cm.`,
    ],
    formula: `mm = cm × ${MM_PER_CM}  ·  cm = mm ÷ ${MM_PER_CM}`,
  },
  {
    id: 'worked-examples',
    title: 'Convert Centimeter to Millimeter: Worked Examples',
    paragraphs: [
      `Measuring a small object: 1.5 cm × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(1.5))} mm.`,
      `Measuring a pencil: 17.5 cm × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(17.5))} mm.`,
      `Measuring a component: 9 cm × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(9))} mm.`,
    ],
  },
  {
    id: 'how-to-use-tool',
    title: 'How to Use the CM to MM Converter',
    paragraphs: [
      'Enter a length in centimeters; millimeters update automatically. Or enter millimeters to get centimeters.',
      'Share result copies a summary with the page URL. Reload calculator and Clear all changes reset the fields. No form submit is required.',
    ],
  },
  {
    id: 'cm-to-mm-conversion-table',
    title: 'CM to MM Conversion Table',
    paragraphs: [
      'Common centimeter lengths with millimeter equivalents. Display values drop insignificant trailing zeros; the calculator keeps full precision.',
    ],
    tableHeaders: ['Centimeters', 'Millimeters'],
    table: EXAMPLE_CM.map((cm) => [
      `${formatLength(cm)} cm`,
      `${formatLength(centimetersToMillimeters(cm))} mm`,
    ]),
  },
  {
    id: 'related-length-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Centimeter Calculator, CM to M Converter, CM to IN Converter, CM to KM Conversion, Meter Converter, and Metric Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CM_TO_MM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert from Centimeter to Millimeter?',
    answer: `Multiply centimeters by ${MM_PER_CM}. Example: 7 × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(7))} mm.`,
  },
  {
    question: 'How Many Millimeters Are in a Centimeter?',
    answer: `There are exactly ${MM_PER_CM} millimeters in 1 centimeter.`,
  },
  {
    question: 'How Do I Convert 15 CM to MM?',
    answer: `15 × ${MM_PER_CM} = ${formatLength(centimetersToMillimeters(15))} mm.`,
  },
  {
    question: 'How Do I Convert 90 MM to CM?',
    answer: `90 ÷ ${MM_PER_CM} = ${formatLength(millimetersToCentimeters(90))} cm.`,
  },
  {
    question: 'How Do I Calculate CM and MM for a Length of One Inch?',
    answer:
      'One inch equals exactly 2.54 centimeters. Because 1 cm = 10 mm, 2.54 × 10 = 25.4, so 1 inch = 2.54 cm = 25.4 mm.',
  },
  {
    question: 'What Is the Conversion from Millimeter to Centimeter?',
    answer: `Divide millimeters by ${MM_PER_CM}. Example: 125 ÷ ${MM_PER_CM} = ${formatLength(millimetersToCentimeters(125))} cm.`,
  },
];
