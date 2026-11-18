import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_DRY_QUART,
  LITERS_PER_US_LIQUID_GALLON,
  US_QUARTS_PER_GALLON,
  VOLUME_UNITS_ML,
  formatVolume,
  quartsToGallons,
} from './calculation';

export const QUARTS_TO_GALLONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Quarts to Gallons Converter' },
  { id: 'what-are-quarts-gallons', label: 'What Are Quarts and Gallons?' },
  { id: 'converting', label: 'Converting Quarts to Gallons' },
  { id: 'how-to-use', label: 'How to Use the Quarts to Gallons Converter' },
  { id: 'conversion-table', label: 'Quarts to Gallons Conversion Chart' },
  { id: 'related-tools', label: 'Other Volume Converters' },
  { id: 'quarts-to-gallons-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_QUARTS = [0.25, 0.5, 1, 2, 3, 4, 5, 8, 10, 12, 16, 20, 40] as const;

export const QUARTS_TO_GALLONS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Quarts to Gallons Converter',
    paragraphs: [
      'Convert quarts to gallons and gallons to quarts for cooking, recipes, liquid containers, and everyday volume checks. The calculator defaults to US customary liquid quarts and gallons.',
      'Expand Other relevant units to see US cups, pints, fluid ounces, milliliters, liters, and Imperial equivalents for the same physical volume.',
    ],
  },
  {
    id: 'what-are-quarts-gallons',
    title: 'What Are Quarts and Gallons?',
    paragraphs: [
      'Quarts and gallons are volume units. Within a matching measurement system, one gallon equals four quarts, so a quart is one-fourth of a gallon.',
      `1 US liquid gallon = exactly ${LITERS_PER_US_LIQUID_GALLON} L (${VOLUME_UNITS_ML.usLiquidGallon} mL). 1 US liquid quart = ${VOLUME_UNITS_ML.usLiquidQuart} mL.`,
      `1 Imperial gallon = exactly ${LITERS_PER_IMPERIAL_GALLON} L (${VOLUME_UNITS_ML.imperialGallon} mL). 1 Imperial quart = ${VOLUME_UNITS_ML.imperialQuart} mL.`,
      `US dry quarts (${formatVolume(LITERS_PER_US_DRY_QUART)} L) are not interchangeable with US liquid quarts. US and Imperial gallons also differ in absolute size.`,
      'Within US liquid volume: 1 gal = 4 qt = 8 pt = 16 cups.',
    ],
    formula: `1 US gal = ${US_QUARTS_PER_GALLON} US qt = 8 US pt = 16 US cups\n1 US qt = 2 US pt\n1 Imp gal = ${US_QUARTS_PER_GALLON} Imp qt`,
  },
  {
    id: 'converting',
    title: 'Converting Quarts to Gallons',
    paragraphs: [
      `When quarts and gallons use the same liquid system: gallons = quarts ÷ ${US_QUARTS_PER_GALLON}.`,
      `Example — 12 US qt: 12 ÷ ${US_QUARTS_PER_GALLON} = ${formatVolume(quartsToGallons(12))} US gal.`,
      `Reverse: quarts = gallons × ${US_QUARTS_PER_GALLON}. Example — 2.5 US gal × ${US_QUARTS_PER_GALLON} = ${formatVolume(2.5 * US_QUARTS_PER_GALLON)} US qt.`,
      'Mixing US and Imperial units (or liquid vs dry quarts) requires liter-based conversion — the calculator handles that when you change the unit selectors.',
    ],
    formula: `gallons = quarts ÷ ${US_QUARTS_PER_GALLON}\nquarts = gallons × ${US_QUARTS_PER_GALLON}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Quarts to Gallons Converter',
    paragraphs: [
      '1. Enter a value in the Quarts field.',
      '2. Read the equivalent gallons.',
      '3. Enter gallons instead to calculate quarts.',
      '4. Select US or UK (or US dry quarts) as needed.',
      '5. Expand Other relevant units for cups, pints, fluid ounces, and metric volume.',
      '6. Use Clear All Changes or Reload Calculator when you want a reset.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Quarts to Gallons Conversion Chart',
    paragraphs: [
      'US liquid quarts to US liquid gallons. Values come from the same conversion engine used by the calculator.',
    ],
    tableHeaders: ['US Quarts', 'US Gallons'],
    table: TABLE_QUARTS.map((qt) => [formatVolume(qt), formatVolume(quartsToGallons(qt))]),
  },
  {
    id: 'related-tools',
    title: 'Other Volume Converters',
    paragraphs: [
      'Related Omega Calculators tools include Gallon Calculator, Volume Conversion, Pints to Gallons Converter, Pints to Cups Converter, Gallons to Cups Converter, Gallons to Quarts Converter, Cups to Quarts Converter, and Cups to Gallons Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const QUARTS_TO_GALLONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 2 Quarts to Gallons?',
    answer: `Divide 2 by ${US_QUARTS_PER_GALLON}. 2 ÷ ${US_QUARTS_PER_GALLON} = ${formatVolume(quartsToGallons(2))} gallons. Therefore 2 US quarts equal half a US gallon.`,
  },
  {
    question: 'How Do I Convert Quarts to Gallons?',
    answer: `Divide the number of quarts by ${US_QUARTS_PER_GALLON} when using matching US liquid units (or matching Imperial units).`,
  },
  {
    question: 'How Many Quarts Are in a Gallon?',
    answer: `There are ${US_QUARTS_PER_GALLON} US liquid quarts in 1 US liquid gallon, and ${US_QUARTS_PER_GALLON} Imperial quarts in 1 Imperial gallon.`,
  },
  {
    question: 'How Many Gallons Are in 8 Quarts?',
    answer: `8 ÷ ${US_QUARTS_PER_GALLON} = ${formatVolume(quartsToGallons(8))} gallons.`,
  },
  {
    question: 'Is 4 Quarts Equal to 1 Gallon?',
    answer:
      'Yes, within matching US liquid units or matching Imperial units. US dry quarts are a different volume.',
  },
  {
    question: 'How Many Cups Are in a Quart?',
    answer: 'One US liquid quart contains 4 US customary cups.',
  },
  {
    question: 'How Many Pints Are in a Gallon?',
    answer: 'One US liquid gallon contains 8 US liquid pints.',
  },
  {
    question: 'Are US Gallons and Imperial Gallons the Same?',
    answer: `No. An Imperial gallon is exactly ${LITERS_PER_IMPERIAL_GALLON} liters, while a US liquid gallon is exactly ${LITERS_PER_US_LIQUID_GALLON} liters.`,
  },
  {
    question: 'Can This Converter Be Used for Cooking?',
    answer:
      'Yes, when the recipe uses the same measurement system selected in the calculator (US liquid by default).',
  },
];
