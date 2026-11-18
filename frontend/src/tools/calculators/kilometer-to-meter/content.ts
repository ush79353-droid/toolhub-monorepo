import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  kilometersToMeters,
  metersToKilometers,
  METERS_PER_KM,
} from './calculation';

export const KM_TO_M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'metric-system', label: 'Length Measurements in the Metric System' },
  { id: 'km-to-m', label: 'How to Convert Kilometers to Meters' },
  { id: 'm-to-km', label: 'How to Convert Meters to Kilometers' },
  { id: 'examples', label: 'Kilometer to Meter Conversion Examples' },
  { id: 'conversion-table', label: 'Kilometer to Meter Conversion Table' },
  { id: 'related-converters', label: 'Other Length Conversion Tools' },
  { id: 'km-to-m-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KM = [0.1, 0.5, 1, 2, 2.5, 3.5, 5, 10, 20, 50, 100] as const;

export const KM_TO_M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'metric-system',
    title: 'Length Measurements in the Metric System',
    paragraphs: [
      'The Kilometer to Meter Converter helps you convert distances between kilometers (km) and meters (m). Enter a value in either field to see the corresponding measurement automatically. Both units belong to the metric system.',
      `The metric system uses the meter as the SI base unit of length. A kilometer represents exactly ${METERS_PER_KM} meters. The prefix kilo- means one thousand.`,
      'Common uses include road distances, running and walking distances, geographic measurements, construction and engineering, and scientific calculations.',
    ],
    formula: `1 km = ${METERS_PER_KM} m\n1 m = 0.001 km`,
  },
  {
    id: 'km-to-m',
    title: 'How to Convert Kilometers to Meters',
    paragraphs: [
      `Multiply the distance in kilometers by ${METERS_PER_KM}.`,
      `Example — convert 3.5 km: 3.5 × ${METERS_PER_KM} = ${formatLength(kilometersToMeters(3.5))} m. Therefore 3.5 km = 3,500 m.`,
    ],
    formula: `m = km × ${METERS_PER_KM}`,
  },
  {
    id: 'm-to-km',
    title: 'How to Convert Meters to Kilometers',
    paragraphs: [
      `Divide the distance in meters by ${METERS_PER_KM}.`,
      `Example — convert 4,500 m: 4500 ÷ ${METERS_PER_KM} = ${formatLength(metersToKilometers(4500))} km. Therefore 4,500 m = 4.5 km.`,
    ],
    formula: `km = m ÷ ${METERS_PER_KM}`,
  },
  {
    id: 'examples',
    title: 'Kilometer to Meter Conversion Examples',
    paragraphs: [
      `Example 1 — a 5-kilometer run: 5 × ${METERS_PER_KM} = ${formatLength(kilometersToMeters(5))} m.`,
      `Example 2 — a 2.535-kilometer distance: 2.535 × ${METERS_PER_KM} = ${formatLength(kilometersToMeters(2.535))} m.`,
      `Example 3 — a 250-meter walk: 250 ÷ ${METERS_PER_KM} = ${formatLength(metersToKilometers(250))} km.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Kilometer to Meter Conversion Table',
    paragraphs: [
      'Common kilometer values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilometers (km)', 'Meters (m)'],
    table: TABLE_KM.map((km) => [formatLength(km), formatLength(kilometersToMeters(km))]),
  },
  {
    id: 'related-converters',
    title: 'Other Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Kilometer Calculator, Distance Converter, Length Converter, Kilometer to Miles Converter, Centimeter Calculator, Millimeter Calculator, Inch Converter, Feet Converter, Meters to Feet Converter, and Inch to Meter Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KM_TO_M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Kilometers to Meters?',
    answer: `Multiply the distance in kilometers by ${METERS_PER_KM}. For example, 4 km × ${METERS_PER_KM} = ${formatLength(kilometersToMeters(4))} m.`,
  },
  {
    question: 'How Many Meters Are in 3.5 Kilometers?',
    answer: `There are ${formatLength(kilometersToMeters(3.5))} meters in 3.5 kilometers (3.5 × ${METERS_PER_KM} = 3500).`,
  },
  {
    question: 'Is 1,000 Meters Equal to 1 Kilometer?',
    answer: `Yes. Exactly ${METERS_PER_KM} meters make one kilometer.`,
  },
  {
    question: 'How Many Meters Are in 2.535 Kilometers?',
    answer: `2.535 × ${METERS_PER_KM} = ${formatLength(kilometersToMeters(2.535))} m.`,
  },
  {
    question: 'How Do I Convert Meters Back to Kilometers?',
    answer: `Divide the meter value by ${METERS_PER_KM}. For example, 8500 ÷ ${METERS_PER_KM} = ${formatLength(metersToKilometers(8500))} km.`,
  },
  {
    question: 'Is a Kilometer Larger Than a Meter?',
    answer: `Yes. One kilometer is exactly ${METERS_PER_KM} times as long as one meter.`,
  },
];
