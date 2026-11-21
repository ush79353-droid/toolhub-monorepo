import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  centimetersToKilometers,
  formatLength,
  kilometersToCentimeters,
} from './calculation';
import { CM_PER_KM } from './types';

export const CM_TO_KM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'meters-kilometers-centimeters', label: 'Meters, Kilometers, and Centimeters' },
  { id: 'how-to-convert-cm-to-km', label: 'How Do I Convert CM to KM?' },
  { id: 'how-to-use-tool', label: 'How to Use This CM to KM Conversion Tool?' },
  { id: 'conversion-reference-table', label: 'Conversion Reference Table' },
  { id: 'related-length-tools', label: 'Other Length Conversion Tools' },
  { id: 'cm-to-km-faq', label: 'FAQs' },
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
  1, 10, 100, 500, 1000, 5000, 10_000, 50_000, 100_000, 150_000, 250_000, 500_000, 1_000_000,
] as const;

export const CM_TO_KM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'meters-kilometers-centimeters',
    title: 'Meters, Kilometers, and Centimeters',
    paragraphs: [
      'Metric length units nest by powers of ten. One meter equals 100 centimeters. One kilometer equals 1000 meters. Therefore one kilometer equals exactly 100,000 centimeters.',
      'Centimeters suit relatively small lengths. Meters fit everyday distances and dimensions. Kilometers are used for larger travel and geographic distances.',
      'The prefix centi means one-hundredth, so 1 cm = 0.01 m. The prefix kilo means one thousand, so 1 km = 1000 m.',
      `Example path: 250,000 cm = 2500 m = ${formatLength(centimetersToKilometers(250_000))} km.`,
    ],
    formula: `1 m = 100 cm  ·  1 km = 1000 m = ${CM_PER_KM} cm`,
  },
  {
    id: 'how-to-convert-cm-to-km',
    title: 'How Do I Convert CM to KM?',
    paragraphs: [
      `Enter the measurement in centimeters, divide by ${CM_PER_KM}, and read the result in kilometers.`,
      `Example 1: 50,000 cm: 50000 ÷ ${CM_PER_KM} = ${formatLength(centimetersToKilometers(50_000))} km.`,
      `Example 2: 250,000 cm: 250000 ÷ ${CM_PER_KM} = ${formatLength(centimetersToKilometers(250_000))} km.`,
      `Example 3: 1,000 cm: 1000 ÷ ${CM_PER_KM} = ${formatLength(centimetersToKilometers(1000))} km.`,
      `To convert kilometers back to centimeters, multiply by ${CM_PER_KM}.`,
    ],
    formula: `km = cm ÷ ${CM_PER_KM}  ·  cm = km × ${CM_PER_KM}`,
  },
  {
    id: 'how-to-use-tool',
    title: 'How to Use This CM to KM Conversion Tool?',
    paragraphs: [
      'Enter a length in centimeters or kilometers. The matching field updates automatically; no Calculate button and no form submit.',
      'Edit either primary field for the reverse conversion. Expand Other metric/imperial length units to see millimeters, meters, inches, feet, and more.',
      'Use Share result, Reload calculator, or Clear all changes when you want a shareable summary or a fresh start.',
    ],
  },
  {
    id: 'conversion-reference-table',
    title: 'Conversion Reference Table',
    paragraphs: [
      'Common centimeter lengths with kilometer equivalents. Display values drop insignificant trailing zeros; the calculator keeps full precision.',
    ],
    tableHeaders: ['Centimeters', 'Kilometers'],
    table: EXAMPLE_CM.map((cm) => [
      `${formatLength(cm)} cm`,
      `${formatLength(centimetersToKilometers(cm))} km`,
    ]),
  },
  {
    id: 'related-length-tools',
    title: 'Other Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Centimeter Calculator, CM to IN Converter, CM to Ft In Converter, Meter Converter, Metric Converter, and Meters to Feet Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CM_TO_KM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert KM to CM?',
    answer: `Multiply kilometers by ${CM_PER_KM}. Example: 2 km = ${formatLength(kilometersToCentimeters(2))} cm.`,
  },
  {
    question: 'How Much Is 0.5 KM in Centimeters?',
    answer: `0.5 × ${CM_PER_KM} = ${formatLength(kilometersToCentimeters(0.5))} cm.`,
  },
  {
    question: 'How Many Kilometers Are in 1000 CM?',
    answer: `1000 ÷ ${CM_PER_KM} = ${formatLength(centimetersToKilometers(1000))} km.`,
  },
  {
    question: 'How Many Centimeters Are in 1 KM?',
    answer: `1 kilometer equals exactly ${formatLength(kilometersToCentimeters(1))} centimeters.`,
  },
  {
    question: 'How Many KM Are in 1 CM?',
    answer: `1 centimeter equals exactly ${formatLength(centimetersToKilometers(1))} kilometers.`,
  },
  {
    question: 'How Do I Convert 10,000 CM to KM?',
    answer: `10000 ÷ ${CM_PER_KM} = ${formatLength(centimetersToKilometers(10_000))} km.`,
  },
];
