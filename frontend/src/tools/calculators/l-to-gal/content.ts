import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatVolume,
  litersToImperialGallons,
  litersToUSGallons,
  usGallonsToLiters,
} from './calculation';
import { LITERS_PER_IMPERIAL_GALLON, LITERS_PER_US_GALLON } from './types';

export const L_TO_GAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'l-to-gal-converter', label: 'L to gal converter' },
  { id: 'how-to-convert-l-to-gal', label: 'How to convert L to gal' },
  { id: 'worth-trying-volume-converters', label: 'Worth trying volume converters' },
  { id: 'l-to-gal-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  links?: readonly { href: string; label: string }[];
}

const TABLE_LITERS = [0.5, 1, 2, 3, 3.8, 5, 7, 10, 20, 50, 100] as const;

export const L_TO_GAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'l-to-gal-converter',
    title: 'L to gal Converter',
    paragraphs: [
      'Liters are the everyday metric volume unit for drinks, fuel, and container capacity. Gallons appear in US customary and Imperial (UK) systems, so converting L to gal only makes sense when you name which gallon you mean.',
      `Exact definitions used here: 1 US liquid gallon = ${LITERS_PER_US_GALLON} L, and 1 Imperial gallon = ${LITERS_PER_IMPERIAL_GALLON} L. An Imperial gallon is larger than a US liquid gallon.`,
      `Therefore 1 L ≈ ${formatVolume(litersToUSGallons(1))} US gal, and 1 L ≈ ${formatVolume(litersToImperialGallons(1))} Imperial gal. US dry gallons are a different unit and are not treated as interchangeable with liquid gallons.`,
    ],
    formula: `1 US gal = ${LITERS_PER_US_GALLON} L · 1 Imperial gal = ${LITERS_PER_IMPERIAL_GALLON} L`,
  },
  {
    id: 'how-to-convert-l-to-gal',
    title: 'How to Convert L to gal',
    paragraphs: [
      `US liquid gallons: US gal = L ÷ ${LITERS_PER_US_GALLON}. Reverse: L = US gal × ${LITERS_PER_US_GALLON}.`,
      `Example: 3.8 L ÷ ${LITERS_PER_US_GALLON} ≈ ${formatVolume(litersToUSGallons(3.8))} US gal.`,
      `Reverse example: 2 US gal × ${LITERS_PER_US_GALLON} = ${formatVolume(usGallonsToLiters(2))} L.`,
      `Imperial gallons: imp gal = L ÷ ${LITERS_PER_IMPERIAL_GALLON}, and L = imp gal × ${LITERS_PER_IMPERIAL_GALLON}.`,
      'Edit liters or gallons in the converter above; values update instantly. Switching US ↔ Imperial keeps the same physical volume while changing only the gallon label.',
    ],
    formula: `US gal = L / ${LITERS_PER_US_GALLON} · L = US gal × ${LITERS_PER_US_GALLON}`,
    tableHeaders: ['Liters (L)', 'US gallons'],
    table: TABLE_LITERS.map((L) => [formatVolume(L), formatVolume(litersToUSGallons(L))]),
  },
  {
    id: 'worth-trying-volume-converters',
    title: 'Worth Trying Volume Converters',
    paragraphs: [
      'Related Omega Calculators tools that already exist for volume work:',
    ],
    links: [
      { href: '/tools/volume-conversion', label: 'Volume Conversion' },
      { href: '/tools/gallon-calculator', label: 'Gallon Calculator' },
      { href: '/tools/liter-to-cc-converter', label: 'Liter to cc Converter' },
      { href: '/tools/liters-to-centiliters-converter', label: 'Liters to Centiliters Converter' },
      { href: '/tools/ml-to-cups-converter', label: 'mL to Cups Converter' },
      { href: '/tools/ccf-to-gallons-conversion', label: 'CCF to Gallons Conversion' },
      { href: '/tools/kg-to-gallons-converter', label: 'kg to Gallons Converter' },
      { href: '/tools/liters-to-pounds-calculator', label: 'Liters to Pounds Calculator' },
    ],
  },
];

export const L_TO_GAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Gallons Are There in 7 Liters?',
    answer: `7 ÷ ${LITERS_PER_US_GALLON} ≈ ${formatVolume(litersToUSGallons(7))} US gallons. In Imperial gallons, 7 ÷ ${LITERS_PER_IMPERIAL_GALLON} ≈ ${formatVolume(litersToImperialGallons(7))} imp gal.`,
  },
  {
    question: 'How Many Liters Are in 3 Gallons?',
    answer: `Assuming US liquid gallons: 3 × ${LITERS_PER_US_GALLON} = ${formatVolume(usGallonsToLiters(3))} L. Three Imperial gallons equal ${formatVolume(3 * LITERS_PER_IMPERIAL_GALLON)} L.`,
  },
  {
    question: 'How Do I Convert 45 Liters to Gallons?',
    answer: `45 ÷ ${LITERS_PER_US_GALLON} ≈ ${formatVolume(litersToUSGallons(45))} US gallons. For Imperial gallons, divide by ${LITERS_PER_IMPERIAL_GALLON} instead.`,
  },
  {
    question: 'What Is the Difference Between US and Imperial Gallons?',
    answer: `1 US liquid gallon = ${LITERS_PER_US_GALLON} L. 1 Imperial gallon = ${LITERS_PER_IMPERIAL_GALLON} L. The Imperial gallon is larger, so the same liter value maps to fewer Imperial gallons than US gallons.`,
  },
  {
    question: 'Is 1 Liter Equal to 1 Gallon?',
    answer: `No. 1 L ≈ ${formatVolume(litersToUSGallons(1))} US gallons, or about ${formatVolume(litersToImperialGallons(1))} Imperial gallons.`,
  },
];
