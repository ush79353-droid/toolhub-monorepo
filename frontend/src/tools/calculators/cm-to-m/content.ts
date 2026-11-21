import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  centimetersToMeters,
  formatLength,
  metersToCentimeters,
} from './calculation';
import { CM_PER_METER } from './types';

export const CM_TO_M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert-cm-to-m', label: 'How Do I Convert CM to M?' },
  { id: 'examples-cm-to-m', label: 'Examples of CM to M Conversion' },
  { id: 'how-to-use-tool', label: 'How to Use the CM to M Converter' },
  { id: 'cm-to-m-conversion-table', label: 'CM to M Conversion Table' },
  { id: 'related-length-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'cm-to-m-faq', label: 'FAQs' },
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
  0, 1, 5, 10, 25, 50, 75, 100, 150, 175, 200, 250, 350, 500, 1000, 10_000,
] as const;

export const CM_TO_M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert-cm-to-m',
    title: 'How Do I Convert CM to M?',
    paragraphs: [
      `Exactly ${CM_PER_METER} centimeters equal 1 meter. To convert centimeters to meters, divide by ${CM_PER_METER}.`,
      `Example 1: 350 cm: 350 ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(350))} m.`,
      `Example 2: 50 cm: 50 ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(50))} m.`,
      `To convert meters to centimeters, multiply by ${CM_PER_METER}. Example: 2.5 × ${CM_PER_METER} = ${formatLength(metersToCentimeters(2.5))} cm.`,
    ],
    formula: `m = cm ÷ ${CM_PER_METER}  ·  cm = m × ${CM_PER_METER}`,
  },
  {
    id: 'examples-cm-to-m',
    title: 'Examples of CM to M Conversion',
    paragraphs: [
      `Measuring a mirror: 155 cm ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(155))} m.`,
      `Measuring a room: 425 cm ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(425))} m.`,
      `Measuring height: 175 cm ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(175))} m.`,
      'The same factors apply for furniture, DIY projects, school math, and construction dimensions.',
    ],
  },
  {
    id: 'how-to-use-tool',
    title: 'How to Use the CM to M Converter',
    paragraphs: [
      'Enter a value in centimeters; meters update automatically. Or enter meters to get centimeters.',
      'Use Other units to view an equivalent measurement such as inches (default), feet, millimeters, or kilometers.',
      'Share result copies a summary with the page URL. Reload calculator and Clear all changes reset the fields. No form submit is required.',
    ],
  },
  {
    id: 'cm-to-m-conversion-table',
    title: 'CM to M Conversion Table',
    paragraphs: [
      'Common centimeter lengths with meter equivalents. Display values drop insignificant trailing zeros; the calculator keeps full precision.',
    ],
    tableHeaders: ['Centimeters', 'Meters'],
    table: EXAMPLE_CM.map((cm) => [
      `${formatLength(cm)} cm`,
      `${formatLength(centimetersToMeters(cm))} m`,
    ]),
  },
  {
    id: 'related-length-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Centimeter Calculator, CM to IN Converter, CM to KM Conversion, Meter Converter, Metric Converter, and Meters to Feet Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CM_TO_M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 50 CM to M?',
    answer: `Divide by ${CM_PER_METER}. 50 ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(50))} m.`,
  },
  {
    question: 'How Many Centimeters Are in a Meter?',
    answer: `There are exactly ${CM_PER_METER} centimeters in 1 meter.`,
  },
  {
    question: 'How Many Meters Are in 1 CM?',
    answer: `1 ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(1))} m.`,
  },
  {
    question: 'How Do I Convert 175 CM to M?',
    answer: `175 ÷ ${CM_PER_METER} = ${formatLength(centimetersToMeters(175))} m.`,
  },
  {
    question: 'How Do I Convert 2.5 M to CM?',
    answer: `2.5 × ${CM_PER_METER} = ${formatLength(metersToCentimeters(2.5))} cm.`,
  },
  {
    question: 'Is 100 CM Equal to 1 Meter?',
    answer: `Yes. Exactly ${CM_PER_METER} centimeters equal 1 meter.`,
  },
];
